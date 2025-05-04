import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
// Load and validate API keys
const openaiApiKey = process.env.OPENAI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;
const claudeApiKey = process.env.CLAUDE_API_KEY;

// Check for valid API keys
if (!groqApiKey || groqApiKey.includes('your_') || /[^\x00-\x7F]/.test(groqApiKey)) {
  console.warn('Warning: GROQ_API_KEY is missing, contains placeholder text, or has invalid characters');
}

if (!claudeApiKey || claudeApiKey.includes('your_') || /[^\x00-\x7F]/.test(claudeApiKey)) {
  console.warn('Warning: CLAUDE_API_KEY is missing, contains placeholder text, or has invalid characters');
}

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

// Whisper Speech-to-Text endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    
    console.log('Received file:', req.file.originalname, 'Size:', req.file.size, 'MIME type:', req.file.mimetype);
    
    // Check if file is empty
    if (req.file.size === 0) {
      return res.status(400).json({ error: 'The uploaded file is empty' });
    }
    
    // Create form data for Groq API
    const formData = new FormData();
    
    // Append the file with a filename that has a proper extension
    const fileStream = fs.createReadStream(req.file.path);
    
    // Determine extension from mimetype or use original filename
    let filename = 'audio.mp3'; // Default fallback
    if (req.file.originalname && req.file.originalname.includes('.')) {
      filename = req.file.originalname;
    } else if (req.file.mimetype) {
      const ext = req.file.mimetype.split('/')[1];
      if (ext) filename = `audio.${ext}`;
    }
    
    formData.append('file', fileStream, { filename });
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('response_format', 'verbose_json');
    
    const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      // Let axios set the correct content-type for multipart/form-data
    }
  });
    
    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    // Handle verbose_json response format from Groq
    const transcriptText = response.data.text || response.data.segments.map(segment => segment.text).join(' ');
    
    res.json({ 
      transcript: transcriptText,
      // Add additional metadata from Groq's verbose response if needed
      duration: response.data.duration || null,
      language: response.data.language || null 
    });
  } catch (error) {
    console.error('Error transcribing audio:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Claude Narrative Assessment endpoint
app.post('/api/assess', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'No transcript provided' });
  }
  
  // Use the assessment criteria prompt from the requirements
  const testPrompt = `
Test Question: Hi there! Tell me about a birthday party you remember?

Assessment Criteria
Basic Structure Elements (0-2 points each)

Setting:
0 = No mention of location or time
1 = Basic mention (e.g., "at my house")
2 = Detailed setting (e.g., "in our backyard with decorations")


Characters:
0 = No mention of other people
1 = Generic mention (e.g., "my friends came")
2 = Specific characters named (e.g., "my friend Emma and my cousins")


Sequence of Events:
0 = Random or single event mentioned
1 = 2-3 events in logical order
2 = 4+ events in clear chronological sequence

Linguistic Complexity (0-2 points each)
Connectives:
0 = No temporal/causal connectives
1 = Basic connectives (and, then)
2 = Advanced connectives (because, after, while)


Descriptive Language:
0 = Minimal description
1 = Some adjectives and specific nouns
2 = Rich descriptive vocabulary

Emotional Content:
0 = No emotions mentioned
1 = Basic emotions stated (happy, sad)
2 = Detailed emotional reactions with reasoning



Overall Coherence (0-4 points)
0 = Disconnected, difficult to follow
1 = Somewhat coherent but major gaps
2 = Mostly coherent with minor gaps
3 = Fully coherent narrative
4 = Exceptional coherence with sophisticated narrative elements

Total Score Interpretation:
0-5: Significant narrative development concerns
6-10: Emerging narrative skills
11-14: Age-appropriate narrative skills
15-16: Advanced narrative development
`;

  // Validate Claude API key before making the API call
  if (!claudeApiKey || claudeApiKey.includes('your_') || /[^\x00-\x7F]/.test(claudeApiKey)) {
    console.error('Error: Invalid Claude API key');  
    // Provide mock data for testing without a valid API key
    return res.json({
      scores: {
        setting: 1,
        characters: 1,
        sequence: 1,
        connectives: 1,
        descriptiveLanguage: 1,
        emotionalContent: 1,
        coherence: 2,
        total: 8,
        interpretation: 'Emerging narrative skills'
      }
    });
  }
  
  try {
    // Call Claude API
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        { 
          role: 'user', 
          content: `${testPrompt}

Child Response:
"${transcript}"

Please provide a detailed assessment with specific scores for each criterion.`
        }
      ]
    }, {
      headers: {
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });
    
    // Parse Claude's assessment response
    const claudeResponse = response.data.content[0].text;
    
    // Extract scores from Claude's response
    // This is a simplified parsing - in production you would want more robust parsing
    // Default scores in case parsing fails
    const scores = {
      setting: 0,
      characters: 0,
      sequence: 0,
      connectives: 0,
      descriptiveLanguage: 0,
      emotionalContent: 0,
      coherence: 0,
      total: 0,
      interpretation: 'Needs assessment'
    };
    
    // Find values in Claude's response
    if (claudeResponse.includes('Setting:')) {
      const settingMatch = claudeResponse.match(/Setting:\s*(\d+)/i);
      if (settingMatch) scores.setting = parseInt(settingMatch[1]);
    }
    
    if (claudeResponse.includes('Characters:')) {
      const charactersMatch = claudeResponse.match(/Characters:\s*(\d+)/i);
      if (charactersMatch) scores.characters = parseInt(charactersMatch[1]);
    }
    
    if (claudeResponse.includes('Sequence of Events:')) {
      const sequenceMatch = claudeResponse.match(/Sequence of Events:\s*(\d+)/i);
      if (sequenceMatch) scores.sequence = parseInt(sequenceMatch[1]);
    }
    
    if (claudeResponse.includes('Connectives:')) {
      const connectivesMatch = claudeResponse.match(/Connectives:\s*(\d+)/i);
      if (connectivesMatch) scores.connectives = parseInt(connectivesMatch[1]);
    }
    
    if (claudeResponse.includes('Descriptive Language:')) {
      const descriptiveMatch = claudeResponse.match(/Descriptive Language:\s*(\d+)/i);
      if (descriptiveMatch) scores.descriptiveLanguage = parseInt(descriptiveMatch[1]);
    }
    
    if (claudeResponse.includes('Emotional Content:')) {
      const emotionalMatch = claudeResponse.match(/Emotional Content:\s*(\d+)/i);
      if (emotionalMatch) scores.emotionalContent = parseInt(emotionalMatch[1]);
    }
    
    if (claudeResponse.includes('Overall Coherence:')) {
      const coherenceMatch = claudeResponse.match(/Overall Coherence:\s*(\d+)/i);
      if (coherenceMatch) scores.coherence = parseInt(coherenceMatch[1]);
    }
    
    if (claudeResponse.includes('Total Score:')) {
      const totalMatch = claudeResponse.match(/Total Score:\s*(\d+)/i);
      if (totalMatch) scores.total = parseInt(totalMatch[1]);
    } else {
      // Calculate total if not explicitly provided
      scores.total = scores.setting + scores.characters + scores.sequence + 
                     scores.connectives + 
                     scores.descriptiveLanguage + scores.emotionalContent + 
                     scores.coherence;
    }
    
    // Set interpretation based on total score
    if (scores.total >= 0 && scores.total <= 5) {
      scores.interpretation = 'Significant narrative development concerns';
    } else if (scores.total >= 6 && scores.total <= 10) {
      scores.interpretation = 'Emerging narrative skills';
    } else if (scores.total >= 11 && scores.total <= 14) {
      scores.interpretation = 'Age-appropriate narrative skills';
    } else if (scores.total >= 15) {
      scores.interpretation = 'Advanced narrative development';
    }
    
    res.json({ scores });
  } catch (error) {
    console.error('Error with Claude API:', error.message);
    res.status(500).json({ 
      error: 'Failed to assess narrative', 
      message: error.message 
    });
  }
});

app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
});
