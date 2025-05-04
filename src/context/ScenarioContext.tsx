
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ScenarioContextValue, ScenarioDetails, FeedbackResponse, DifficultyLevel, ProgressData, ScenarioMetrics } from '@/types';
import { toast } from 'sonner';

// Default progress data
const defaultProgressData: ProgressData = {
  scenarios: {},
  settings: {
    defaultDifficulty: 'beginner',
    userName: 'Friend',
    age: 7
  }
};

// Create a context for managing scenario state
const ScenarioContext = createContext<ScenarioContextValue | undefined>(undefined);

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioDetails | null>(null);
  const [userResponse, setUserResponse] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [stepFeedback, setStepFeedback] = useState<any | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('beginner');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [totalSteps, setTotalSteps] = useState<number>(3);
  const [progressData, setProgressData] = useState<ProgressData>(() => {
    // Load progress from localStorage if available
    const savedProgress = localStorage.getItem('speechTherapyProgress');
    return savedProgress ? JSON.parse(savedProgress) : defaultProgressData;
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('speechTherapyProgress', JSON.stringify(progressData));
  }, [progressData]);

  // Reset the current scenario
  const resetScenario = () => {
    setUserResponse('');
    setFeedback(null);
    setStepFeedback(null);
    setCurrentStep(1);
  };

  // Advance to the next step in multi-step scenario
  const advanceToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setUserResponse('');
      setStepFeedback(null);
    }
  };

  // Update progress data for a scenario
  const updateProgress = (scenarioId: string, metrics: Partial<ScenarioMetrics>) => {
    setProgressData(prevData => {
      const updatedScenarios = { ...prevData.scenarios };
      
      // Initialize scenario data if it doesn't exist
      if (!updatedScenarios[scenarioId]) {
        updatedScenarios[scenarioId] = {
          attempts: 0,
          completions: 0,
          averageScores: {
            articulation: 0,
            fluency: 0,
            vocabulary: 0,
            grammar: 0,
            communication: 0,
            empathy: 0,
            cooperation: 0,
            selfControl: 0
          },
          lastCompletedAt: new Date().toISOString()
        };
      }
      
      // Update with new metrics
      updatedScenarios[scenarioId] = {
        ...updatedScenarios[scenarioId],
        ...metrics,
        lastCompletedAt: new Date().toISOString()
      };
      
      return {
        ...prevData,
        scenarios: updatedScenarios
      };
    });
  };

  // Simulate voice input for demo purposes
  const simulateVoiceInput = (text: string) => {
    if (isLoading) return;
    
    setIsListening(true);
    setUserResponse('');
    
    // Simulate typing effect
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setUserResponse(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsListening(false);
      }
    }, 50);
  };

  return (
    <ScenarioContext.Provider
      value={{
        activeScenario,
        setActiveScenario,
        userResponse,
        setUserResponse,
        feedback,
        setFeedback,
        stepFeedback,
        setStepFeedback,
        isListening,
        setIsListening,
        isLoading,
        setIsLoading,
        resetScenario,
        simulateVoiceInput,
        selectedDifficulty,
        setSelectedDifficulty,
        currentStep,
        setCurrentStep,
        totalSteps,
        setTotalSteps,
        advanceToNextStep,
        progressData,
        updateProgress
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = (): ScenarioContextValue => {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
};
