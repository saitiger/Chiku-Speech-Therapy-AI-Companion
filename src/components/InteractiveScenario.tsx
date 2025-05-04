import React, { useState, useEffect } from 'react';
import { useScenario } from '@/context/ScenarioContext';
import { ResponseOption, DifficultyLevelContent } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import CharacterBubble from '@/components/CharacterBubble';

interface InteractiveScenarioProps {
  scenarioContent: DifficultyLevelContent;
}

const InteractiveScenario: React.FC<InteractiveScenarioProps> = ({ scenarioContent }) => {
  const { currentStep, setCurrentStep, activeScenario, setFeedback, updateProgress } = useScenario();
  const [selectedResponse, setSelectedResponse] = useState<ResponseOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Get current exchange based on the step
  const currentExchange = scenarioContent?.dialogue.exchanges[currentStep - 1];
  
  // Reset state when scenario changes
  useEffect(() => {
    setCurrentStep(1);
    setSelectedResponse(null);
    setShowFeedback(false);
    setCompleted(false);
  }, [scenarioContent, setCurrentStep]);
  
  if (!scenarioContent || !currentExchange) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-speech-dark">Scenario content is not available.</p>
      </div>
    );
  }
  
  const handleSelectResponse = (response: ResponseOption) => {
    setSelectedResponse(response);
    setShowFeedback(true);
  };
  
  // Find and update the incrementStep function to explicitly return a number
  const incrementStep = () => {
    setCurrentStep((prev: number) => {
      const newStep = prev + 1;
      return newStep;
    });
  };
  
  const handleNextStep = () => {
    setSelectedResponse(null);
    setShowFeedback(false);
    
    // If we've reached the end of the scenario
    if (currentStep >= scenarioContent.dialogue.exchanges.length) {
      setCompleted(true);
      
      // Generate a feedback summary based on responses
      if (activeScenario) {
        // Simple mock feedback for now
        const mockFeedback = {
          articulation: 4,
          fluency: 3,
          vocabulary: 4,
          grammar: 3,
          communication: 4,
          empathy: 3,
          cooperation: 4,
          selfControl: 3,
          summary: "You did a great job completing this scenario!",
          suggestion: "Try using more descriptive words in your responses next time.",
          encouragement: "Keep practicing and you'll become a communication star!",
          articulationFeedback: "Your pronunciation was very clear.",
          fluencyFeedback: "You spoke at a nice, steady pace.",
          vocabularyFeedback: "You used a good variety of words.",
          grammarFeedback: "Your sentences were well-structured.",
          communicationFeedback: "You expressed yourself clearly.",
          empathyFeedback: "You showed understanding of feelings.",
          cooperationFeedback: "You were very cooperative in the conversation.",
          selfControlFeedback: "You stayed focused throughout the activity."
        };
        
        setFeedback(mockFeedback);
        
        // Update progress
        updateProgress(activeScenario.id, {
          attempts: 1,
          completions: 1,
          averageScores: mockFeedback
        });
        
        toast.success("Scenario completed!");
      }
    } else {
      // Move to the next step
      incrementStep();
    }
  };
  
  // Calculate the quality score based on the selected response quality
  const getQualityColor = () => {
    if (!selectedResponse) return "bg-gray-200";
    
    switch (selectedResponse.quality) {
      case "Excellent": return "bg-green-500";
      case "Good": return "bg-blue-500";
      case "Basic": return "bg-yellow-500";
      case "Needs Improvement": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="w-full">
      {/* Scene description */}
      <Card className="mb-6 bg-speech-light/50">
        <CardContent className="p-4">
          <p className="italic text-speech-dark">{scenarioContent.dialogue.sceneDescription}</p>
        </CardContent>
      </Card>
      
      {/* Character speech */}
      <div className="mb-6">
        <CharacterBubble
          character={{ 
            name: currentExchange.character, 
            imageUrl: '/stella.png' // Default image, should be based on character
          }}
          message={currentExchange.text}
        />
      </div>
      
      {/* Visual support if available */}
      {currentExchange.visualSupport && (
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-2 rounded-lg shadow-md max-w-md">
            <img
              src="/story-image.png" // Placeholder for actual visual support
              alt="Visual support"
              className="w-full rounded"
            />
            <p className="text-xs text-center mt-1 text-speech-dark/70">
              {currentExchange.visualSupport}
            </p>
          </div>
        </div>
      )}
      
      {/* Response options */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-speech-dark mb-3 flex items-center">
          <MessageSquare size={18} className="mr-2" />
          Your Response
        </h3>
        
        <div className="space-y-3">
          {currentExchange.responseOptions.map((option, index) => (
            <div 
              key={index}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedResponse === option
                  ? 'border-2 border-speech-purple bg-speech-light/30'
                  : 'border-gray-200 hover:border-speech-purple/50 hover:bg-speech-light/10'
              }`}
              onClick={() => !showFeedback && handleSelectResponse(option)}
            >
              <p className="text-speech-dark">{option.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feedback when a response is selected */}
      {showFeedback && selectedResponse && (
        <div className="mb-6">
          <Card className={`overflow-hidden`}>
            <div className={`h-2 ${getQualityColor()}`}></div>
            <CardContent className="p-4">
              <h4 className="font-bold text-speech-dark mb-1">{selectedResponse.quality}</h4>
              <p className="text-speech-dark/80">{selectedResponse.feedback}</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Next button */}
      {showFeedback && (
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleNextStep}
            className="bg-speech-purple hover:bg-speech-purple/90 flex items-center gap-2"
          >
            {currentStep >= scenarioContent.dialogue.exchanges.length ? 'Complete' : 'Next'}
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default InteractiveScenario;
