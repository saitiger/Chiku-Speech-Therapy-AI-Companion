
import React, { useEffect } from 'react';
import CharacterBubble from '@/components/CharacterBubble';
import ResponseInput from '@/components/ResponseInput';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import { useScenario } from '@/context/ScenarioContext';
import { Card, CardContent } from '@/components/ui/card';

const ScenarioPage: React.FC = () => {
  const { activeScenario, feedback, isLoading } = useScenario();
  
  useEffect(() => {
    // Scroll to top when scenario changes
    window.scrollTo(0, 0);
  }, [activeScenario]);
  
  if (!activeScenario) return null;
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full mb-8">
        <Card className="bg-speech-light border-none shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-speech-dark mb-2">
              {activeScenario.instruction}
            </h2>
          </CardContent>
        </Card>
      </div>
      
      {activeScenario.imageUrl && (
        <div className="w-full mb-8 flex justify-center">
          <div className="w-full max-w-md bg-white p-3 rounded-xl shadow-md">
            <img 
              src={activeScenario.imageUrl} 
              alt="Scenario illustration" 
              className="w-full rounded-lg object-cover aspect-video"
            />
          </div>
        </div>
      )}
      
      <CharacterBubble
        character={activeScenario.character}
        message={activeScenario.prompt}
      />
      
      {feedback ? (
        <FeedbackDisplay />
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
