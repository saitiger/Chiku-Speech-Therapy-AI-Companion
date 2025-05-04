
import React, { useEffect, useState } from 'react';
import { useScenario } from '@/context/ScenarioContext';
import ResponseInput from '@/components/ResponseInput';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import InteractiveScenario from '@/components/InteractiveScenario';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadScenarioMarkdown, parseScenarioMarkdown } from '@/utils/scenarioParser';
import { DifficultyLevelContent } from '@/types';

const ScenarioPage: React.FC = () => {
  const { 
    activeScenario, 
    feedback, 
    isLoading, 
    selectedDifficulty, 
    resetScenario 
  } = useScenario();
  
  const [scenarioContent, setScenarioContent] = useState<Record<string, DifficultyLevelContent> | null>(null);
  const navigate = useNavigate();
  
  // Load scenario markdown when component mounts or scenario changes
  useEffect(() => {
    const fetchScenarioContent = async () => {
      if (!activeScenario) return;
      
      // Check if this scenario should use the demo content
      const useDemo = 'useDemo' in activeScenario && activeScenario.useDemo === true;
      const markdown = await loadScenarioMarkdown(useDemo ? 'cafe' : undefined);
      
      if (markdown) {
        const parsed = parseScenarioMarkdown(markdown);
        setScenarioContent(parsed);
      }
    };
    
    fetchScenarioContent();
    // Scroll to top when scenario changes
    window.scrollTo(0, 0);
  }, [activeScenario]);
  
  const handleBackToHome = () => {
    resetScenario();
    navigate('/');
  };
  
  if (!activeScenario) return null;
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full mb-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={handleBackToHome}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Button>
      </div>
      
      <div className="w-full mb-8">
        <Card className="bg-speech-light border-none shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-speech-dark mb-4">
              {activeScenario.title}
            </h2>
            <p className="text-speech-dark/80 mb-4">
              {activeScenario.instruction}
            </p>
            
            {/* Removing the difficulty selector as requested */}
          </div>
        </Card>
      </div>
      
      {feedback ? (
        <FeedbackDisplay />
      ) : scenarioContent && scenarioContent[selectedDifficulty] ? (
        <InteractiveScenario scenarioContent={scenarioContent[selectedDifficulty]} />
      ) : (
        <ResponseInput />
      )}
      
      {isLoading && (
        <div className="mt-8 text-center w-full">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-speech-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-speech-dark">Processing your response...</p>
        </div>
      )}
    </div>
  );
};

export default ScenarioPage;
