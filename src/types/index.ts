
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
  difficultyLevels?: DifficultyLevel[];
  targetSkills?: TargetSkill[];
}

export interface Character {
  name: string;
  imageUrl: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type TargetSkill = 
  | 'articulation' 
  | 'fluency' 
  | 'vocabulary' 
  | 'grammar' 
  | 'communication'
  | 'empathy'
  | 'cooperation'
  | 'selfControl';

export interface ScenarioStep {
  step: number;
  prompt: string;
  intent: string;
  visualSupport?: string;
  audioPrompt?: boolean;
}

export interface ResponseOption {
  text: string;
  quality: 'Needs Improvement' | 'Basic' | 'Good' | 'Excellent';
  feedback: string;
}

export interface DifficultyLevelContent {
  level: DifficultyLevel;
  steps: ScenarioStep[];
  dialogue: {
    sceneDescription: string;
    exchanges: {
      character: string;
      text: string;
      visualSupport?: string;
      responseOptions: ResponseOption[];
    }[];
  };
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
  selectedDifficulty: DifficultyLevel;
  setSelectedDifficulty: (difficulty: DifficultyLevel) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  progressData: ProgressData;
  updateProgress: (scenarioId: string, metrics: Partial<ScenarioMetrics>) => void;
}

export interface GameCard {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  path: string;
  backgroundColor: string;
}

export interface ScenarioMetrics {
  attempts: number;
  completions: number;
  averageScores: {
    articulation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
    communication: number;
    empathy: number;
    cooperation: number;
    selfControl: number;
  };
  lastCompletedAt: string;
}

export interface ProgressData {
  scenarios: Record<string, ScenarioMetrics>;
  settings: {
    defaultDifficulty: DifficultyLevel;
    userName: string;
    age: number;
  };
}
