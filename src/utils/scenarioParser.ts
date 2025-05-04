
import { DifficultyLevel, DifficultyLevelContent, ResponseOption, ScenarioStep } from '@/types';

export const parseScenarioMarkdown = (markdown: string): Record<DifficultyLevel, DifficultyLevelContent> => {
  const result: Record<DifficultyLevel, DifficultyLevelContent> = {
    beginner: { level: 'beginner', steps: [], dialogue: { sceneDescription: '', exchanges: [] } },
    intermediate: { level: 'intermediate', steps: [], dialogue: { sceneDescription: '', exchanges: [] } },
    advanced: { level: 'advanced', steps: [], dialogue: { sceneDescription: '', exchanges: [] } }
  };

  // Split markdown by difficulty level
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

export const loadScenarioMarkdown = async (): Promise<string> => {
  try {
    const response = await fetch('/assets/scenario_example_multilevels.md');
    if (!response.ok) {
      throw new Error('Failed to load scenario markdown');
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading scenario markdown:', error);
    return '';
  }
};
