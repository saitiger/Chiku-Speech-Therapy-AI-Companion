import { FeedbackResponse } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Speech-to-text conversion using Groq Whisper API via Supabase Edge Function
export const convertSpeechToText = async (audioBlob: Blob): Promise<string> => {
  try {
    console.log('Converting speech to text using Groq Whisper API');
    // Convert audio blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    console.log('Audio converted to base64, length:', base64Audio.length);
    
    // Call the Edge Function for speech-to-text conversion
    const { data, error } = await supabase.functions.invoke('groq-whisper', {
      body: { audio: base64Audio }
    });

    if (error) {
      console.error('Supabase Edge Function error (speech-to-text):', error);
      toast.error('Unable to convert speech to text. Please try typing instead.');
      return '';
    }

    console.log('Transcription result:', data);
    return data.text || '';
  } catch (supabaseError) {
    console.error('Error calling Supabase Edge Function (speech-to-text):', supabaseError);
    toast.error('Unable to convert speech to text. Please try typing instead.');
    return '';
  }
};

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Evaluate response using Claude API via Supabase Edge Function
export const evaluateResponse = async (
  childResponse: string,
  scenarioContext: string
): Promise<FeedbackResponse> => {
  try {
    // Call the Supabase Edge Function that handles Claude API with expanded rubric
    const { data, error } = await supabase.functions.invoke('claude-evaluation', {
      body: {
        childResponse,
        scenarioContext
      }
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      toast.error('Unable to connect to Claude. Using simulated feedback instead.');
      // Fall back to simulation if Edge Function fails
      return simulateFeedback(childResponse, scenarioContext);
    }

    return data as FeedbackResponse;
  } catch (supabaseError) {
    console.error('Error calling Supabase Edge Function:', supabaseError);
    toast.error('Unable to connect to Claude. Using simulated feedback instead.');
    // Fall back to simulation if there's an error
    return simulateFeedback(childResponse, scenarioContext);
  }
};

// Separate function for simulated feedback
const simulateFeedback = async (
  childResponse: string, 
  scenarioContext: string
): Promise<FeedbackResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This is a simulation - in a real app, this would be a call to Claude API
  // Generate simulated feedback based on response length and content
  
  // Simple scoring based on response length and certain keywords
  const responseLength = childResponse.length;
  
  const communicationScore = Math.min(5, Math.max(1, Math.floor(responseLength / 20)));
  
  // Look for emotional words for empathy score
  const empathyWords = ['feel', 'sad', 'happy', 'sorry', 'understand', 'help'];
  const empathyScore = Math.min(5, Math.max(1, 
    empathyWords.filter(word => childResponse.toLowerCase().includes(word)).length + 2
  ));
  
  // Look for cooperative phrases
  const cooperationWords = ['we', 'together', 'please', 'thank', 'friend', 'play', 'share'];
  const cooperationScore = Math.min(5, Math.max(1, 
    cooperationWords.filter(word => childResponse.toLowerCase().includes(word)).length + 2
  ));
  
  // Simple self-control score
  const selfControlScore = Math.min(5, Math.max(3, 5));
  
  // Simulate speech & language skills scores
  const articulationScore = Math.min(5, Math.max(2, 4));
  const fluencyScore = Math.min(5, Math.max(1, Math.floor(responseLength / 25)));
  const vocabularyScore = Math.min(5, Math.max(1, 
    new Set(childResponse.toLowerCase().split(/\s+/)).size / 5
  ));
  const grammarScore = Math.min(5, Math.max(2, 3));
  
  // Generate feedback based on scenario context and response
  let summary, suggestion, encouragement;
  
  if (scenarioContext.includes("meeting a new friend")) {
    summary = "You did a great job introducing yourself! Your greeting was friendly and clear.";
    suggestion = "Next time, you could also ask a question about what they like to do.";
    encouragement = "Keep practicing your introductions - you're doing fantastic!";
  } else if (scenarioContext.includes("tell a short story")) {
    summary = "You created a wonderful story with good details about what you saw in the picture.";
    suggestion = "Try adding how the characters might be feeling in your next story.";
    encouragement = "You're becoming an amazing storyteller!";
  } else {
    summary = "You expressed your feelings very well and used good words to explain how you felt.";
    suggestion = "You could also mention what would make you feel better next time.";
    encouragement = "Great job talking about your feelings - that takes courage!";
  }
  
  // Category-specific feedback
  const categoryFeedback = {
    articulationFeedback: "Your speech sounds were clear and easy to understand.",
    fluencyFeedback: "You spoke smoothly with a good rhythm.",
    vocabularyFeedback: "You used a variety of words that fit the situation well.",
    grammarFeedback: "Your sentences were complete and well-formed.",
    communicationFeedback: "You communicated your ideas clearly.",
    empathyFeedback: "You showed good understanding of feelings.",
    cooperationFeedback: "You were polite and took turns in the conversation.",
    selfControlFeedback: "You expressed yourself calmly and appropriately."
  };
  
  return {
    // Speech & Language Skills
    articulation: articulationScore,
    fluency: fluencyScore,
    vocabulary: vocabularyScore,
    grammar: grammarScore,
    
    // Social-Communication Skills
    communication: communicationScore,
    empathy: empathyScore,
    cooperation: cooperationScore,
    selfControl: selfControlScore,
    
    // Feedback text
    summary,
    suggestion,
    encouragement,
    
    // Category-specific feedback
    ...categoryFeedback
  };
};

// Export the main function that will try to use Claude or fall back to simulation
export const generateClaudeFeedback = async (
  childResponse: string,
  scenarioContext: string
): Promise<FeedbackResponse> => {
  return evaluateResponse(childResponse, scenarioContext);
};
