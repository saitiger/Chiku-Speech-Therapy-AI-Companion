
import React, { createContext, useState, useContext } from 'react';
import { ScenarioContextValue, ScenarioDetails, FeedbackResponse } from '@/types';
import { toast } from 'sonner';

// Create a context for managing scenario state
const ScenarioContext = createContext<ScenarioContextValue | undefined>(undefined);

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioDetails | null>(null);
  const [userResponse, setUserResponse] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Reset the current scenario
  const resetScenario = () => {
    setUserResponse('');
    setFeedback(null);
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
        isListening,
        setIsListening,
        isLoading,
        setIsLoading,
        resetScenario,
        simulateVoiceInput,
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
