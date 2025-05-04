import { DifficultyLevel, DifficultyLevelContent, ResponseOption, ScenarioStep } from '@/types';

export const parseScenarioMarkdown = (markdown: string): Record<DifficultyLevel, DifficultyLevelContent> => {
  const result: Record<DifficultyLevel, DifficultyLevelContent> = {
    beginner: { level: 'beginner', steps: [], dialogue: { sceneDescription: '', exchanges: [] } },
    intermediate: { level: 'intermediate', steps: [], dialogue: { sceneDescription: '', exchanges: [] } },
    advanced: { level: 'advanced', steps: [], dialogue: { sceneDescription: '', exchanges: [] } }
  };

  // Check if this is a demo scenario with a JSON structure
  const jsonScenarioMatch = markdown.match(/```json\s*({[\s\S]*?})\s*```/);
  if (jsonScenarioMatch && jsonScenarioMatch[1]) {
    try {
      // Parse JSON from the demo scenario
      const demoScenario = JSON.parse(jsonScenarioMatch[1]);
      
      // Create a fallback scenario from the demo data
      const dialogueExchanges = demoScenario.steps.map(step => {
        return {
          character: step.character || "Barista",
          text: step.character_dialog || step.prompt,
          visualSupport: step.visual_support,
          responseOptions: step.response_options.map(option => ({
            text: option.text,
            quality: option.quality || "Basic",
            feedback: option.feedback
          }))
        };
      });
      
      // Use the demo scenario for all difficulty levels for now
      const demoContent = {
        sceneDescription: demoScenario.description || "A scenario at a café counter.",
        exchanges: dialogueExchanges
      };
      
      result.beginner.dialogue = demoContent;
      result.intermediate.dialogue = demoContent;
      result.advanced.dialogue = demoContent;
      result.beginner.steps = demoScenario.steps;
      result.intermediate.steps = demoScenario.steps;
      result.advanced.steps = demoScenario.steps;
      
      return result;
    } catch (error) {
      console.error('Error parsing demo scenario JSON:', error);
    }
  }

  // If not a demo scenario, proceed with regular parsing
  const sections = markdown.split(/## (Beginner|Intermediate|Advanced) Level/i);

  // Process each difficulty level section
  for (let i = 1; i < sections.length; i += 2) {
    const level = sections[i].toLowerCase() as DifficultyLevel;
    const content = sections[i + 1];

    // Parse scenario structure from JSON code blocks
    const structureMatch = content.match(/```json\s*({[\s\S]*?})\s*```/);
    if (structureMatch && structureMatch[1]) {
      try {
        const structure = JSON.parse(structureMatch[1]);
        result[level].steps = structure.scenario || [];
      } catch (error) {
        console.error(`Error parsing JSON for ${level} level:`, error);
      }
    }

    // Parse interactive dialogue format
    const dialogueMatch = content.match(/### Interactive Dialogue Format([\s\S]*?)(?=##|\n```|$)/);
    if (dialogueMatch && dialogueMatch[1]) {
      const dialogueText = dialogueMatch[1];

      // Extract scene description
      const sceneDescMatch = dialogueText.match(/\*\*Scene Description:\*\*([\s\S]*?)(?=\*\*|$)/);
      result[level].dialogue.sceneDescription = sceneDescMatch ? sceneDescMatch[1].trim() : '';

      // Extract exchanges
      const exchanges: any[] = [];
      let currentExchange: any = null;
      
      // Split by bold sections which usually indicate speaker changes
      const parts = dialogueText.split(/\*\*([^*]+)\*\*/);
      
      for (let j = 1; j < parts.length; j += 2) {
        const speaker = parts[j].trim();
        const content = parts[j + 1] || '';
        
        if (speaker === 'Player Response Options:') {
          // Process response options
          if (currentExchange) {
            currentExchange.responseOptions = parseResponseOptions(content);
            exchanges.push(currentExchange);
            currentExchange = null;
          }
        } else if (speaker.includes('Barista:') || speaker.includes('Narrator:') || speaker.includes(':')) {
          // Start a new exchange
          if (currentExchange) {
            exchanges.push(currentExchange);
          }
          
          const visualMatch = content.match(/\[Visual:(.*?)\]/);
          
          currentExchange = {
            character: speaker.replace(':', '').trim(),
            text: content.replace(/\[Visual:.*?\]/g, '').trim(),
            visualSupport: visualMatch ? visualMatch[1].trim() : undefined,
            responseOptions: []
          };
        }
      }
      
      // Add the last exchange if it exists
      if (currentExchange) {
        exchanges.push(currentExchange);
      }
      
      result[level].dialogue.exchanges = exchanges;
    }
  }

  return result;
};

// Helper function to parse response options
const parseResponseOptions = (text: string): ResponseOption[] => {
  const options: ResponseOption[] = [];
  
  // Split by response pattern (usually starts with quotes or actions in brackets)
  const optionPatterns = text.split(/\n(?=(?:"|"|\[))/);
  
  for (const pattern of optionPatterns) {
    if (!pattern.trim()) continue;
    
    // Extract response text (either in quotes or brackets)
    const textMatch = pattern.match(/"([^"]+)"|"([^"]+)"|\[([^\]]+)\]/);
    if (!textMatch) continue;
    
    const responseText = (textMatch[1] || textMatch[2] || textMatch[3] || '').trim();
    
    // Extract quality rating (usually bold text after the response)
    const qualityMatch = pattern.match(/\*\*(Needs Improvement|Basic|Good|Excellent)\*\*/i);
    const quality = qualityMatch ? qualityMatch[1] as ResponseOption['quality'] : 'Basic';
    
    // Extract feedback (usually in italics after the quality)
    const feedbackMatch = pattern.match(/\*(.*?)\*/);
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';
    
    options.push({ text: responseText, quality, feedback });
  }
  
  return options;
};

export const loadScenarioMarkdown = async (scenarioId?: string): Promise<string> => {
  try {
    // If scenarioId is "cafe", load the demo scenario
    if (scenarioId === "cafe") {
      const demoResponse = await fetch('/assets/demo-scenario.md');
      if (demoResponse.ok) {
        console.log("Using cafe demo scenario data");
        return await demoResponse.text();
      }
    }
    
    // Fall back to the example scenario if demo is not available or not requested
    const exampleResponse = await fetch('/assets/scenario_example_multilevels.md');
    if (exampleResponse.ok) {
      return await exampleResponse.text();
    }
    
    // If neither file is available, use the fallback
    console.log("Using fallback scenario data");
    return generateFallbackScenario();
  } catch (error) {
    console.error('Error loading scenario markdown:', error);
    return generateFallbackScenario();
  }
};

// Generate a basic fallback scenario for the "Friendly Greetings" demo
function generateFallbackScenario(): string {
  return `
## Beginner Level

\`\`\`json
{
  "title": "Café Counter",
  "difficulty": "intermediate",
  "description": "A scenario taking place at a café counter, practicing ordering skills, expressing preferences, and handling a problem politely.",
  "visual_background": "busy_cafe_scene.png",
  "steps": [
    {
      "step": 1,
      "prompt": "You're at the café counter. The barista asks: 'Hi there! What can I get for you today?' How do you order?",
      "intent": "Practice making a specific request",
      "visual_support": "menu_with_options.png",
      "audio_prompt": true,
      "character": "barista",
      "character_dialog": "Hi there! What can I get for you today?",
      "response_options": [
        {
          "text": "Um... chocolate.",
          "quality": "Needs Improvement",
          "feedback": "Try being more specific about what you want"
        },
        {
          "text": "Hot chocolate.",
          "quality": "Basic",
          "feedback": "Good choice! Can you make it a complete sentence?"
        },
        {
          "text": "I would like a small hot chocolate, please.",
          "quality": "Excellent",
          "feedback": "Excellent! Clear, complete request with good manners"
        }
      ]
    },
    {
      "step": 2,
      "prompt": "The barista asks: 'Would you like whipped cream on that?' What would you say?",
      "intent": "Practice expressing preference with detail",
      "visual_support": "drink_with_without_whipped_cream.png",
      "audio_prompt": true,
      "character": "barista",
      "character_dialog": "Would you like whipped cream on that?",
      "response_options": [
        {
          "text": "Yes.",
          "quality": "Basic",
          "feedback": "Good clear answer. You could add \\"please\\" to be more polite"
        },
        {
          "text": "Yes, please.",
          "quality": "Good",
          "feedback": "Good job being polite!"
        },
        {
          "text": "Yes, please. I love whipped cream on hot chocolate.",
          "quality": "Excellent",
          "feedback": "Excellent! You gave a clear answer, were polite, and added detail"
        }
      ]
    },
    {
      "step": 3,
      "prompt": "Your name is called, but they gave you the wrong drink. What would you say to the barista?",
      "intent": "Practice polite problem-solving",
      "visual_support": "wrong_drink.png",
      "audio_prompt": true,
      "character": "barista",
      "character_dialog": "Order for [child's name]!",
      "situation_note": "The barista is holding coffee instead of hot chocolate",
      "response_options": [
        {
          "text": "That's wrong!",
          "quality": "Needs Improvement",
          "feedback": "Good for speaking up, but try using a more polite approach"
        },
        {
          "text": "Excuse me, I ordered hot chocolate, not coffee.",
          "quality": "Good",
          "feedback": "Good job explaining the problem clearly and politely"
        },
        {
          "text": "Excuse me, there seems to be a mix-up. I ordered a hot chocolate with whipped cream, not coffee.",
          "quality": "Excellent",
          "feedback": "Excellent! You explained the problem clearly, politely, and with specific details"
        }
      ]
    }
  ],
  "skills_targeted": {
    "speech_language": ["vocabulary", "grammar", "articulation"],
    "social_communication": ["clarity", "politeness", "problem-solving"]
  }
}
\`\`\`

### Interactive Dialogue Format

**Scene Description:**
You're at a busy café, standing at the counter to order a drink.

**Barista:**
"Hi there! What can I get for you today?"

**Player Response Options:**
"Um... chocolate."
**Needs Improvement**
*Try being more specific about what you want*

"Hot chocolate."
**Basic**
*Good choice! Can you make it a complete sentence?*

"I would like a small hot chocolate, please."
**Excellent**
*Excellent! Clear, complete request with good manners*

**Barista:**
"Would you like whipped cream on that?"

**Player Response Options:**
"Yes."
**Basic**
*Good clear answer. You could add "please" to be more polite*

"Yes, please."
**Good**
*Good job being polite!*

"Yes, please. I love whipped cream on hot chocolate."
**Excellent**
*Excellent! You gave a clear answer, were polite, and added detail*

**Barista:**
"Order for you! Here's your drink."

**Player Response Options:**
"That's wrong!"
**Needs Improvement**
*Good for speaking up, but try using a more polite approach*

"Excuse me, I ordered hot chocolate, not coffee."
**Good**
*Good job explaining the problem clearly and politely*

"Excuse me, there seems to be a mix-up. I ordered a hot chocolate with whipped cream, not coffee."
**Excellent**
*Excellent! You explained the problem clearly, politely, and with specific details*
`;
