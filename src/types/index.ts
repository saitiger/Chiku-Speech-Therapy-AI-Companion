
// Define types for our application

export interface Scenario {
  id: string;
  title: string;
  description: string;
  iconName: string;
  backgroundClass: string;
}

export interface ScenarioDetails {
  id: string;
  title: string;
  instruction: string;
  prompt: string;
  imageUrl?: string;
  character: Character;
}

export interface Character {
  name: string;
  imageUrl: string;
}

export interface FeedbackResponse {
  // Speech & Language Skills
  articulation: number;
  fluency: number;
  vocabulary: number;
  grammar: number;
  
  // Social-Communication Skills (original SSIS framework)
  communication: number;
  empathy: number;
  cooperation: number;
  selfControl: number;
  
  // Feedback text
  summary: string;
  suggestion: string;
  encouragement: string;
  
  // Category-specific feedback
  articulationFeedback?: string;
  fluencyFeedback?: string;
  vocabularyFeedback?: string;
  grammarFeedback?: string;
  communicationFeedback?: string;
  empathyFeedback?: string;
  cooperationFeedback?: string;
  selfControlFeedback?: string;
}

export interface ScenarioContextValue {
  activeScenario: ScenarioDetails | null;
  setActiveScenario: (scenario: ScenarioDetails | null) => void;
  userResponse: string;
  setUserResponse: (response: string) => void;
  feedback: FeedbackResponse | null;
  setFeedback: (feedback: FeedbackResponse | null) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  resetScenario: () => void;
  simulateVoiceInput: (text: string) => void;
}

export interface GameCard {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  path: string;
  backgroundColor: string;
}
