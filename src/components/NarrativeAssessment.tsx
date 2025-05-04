
import React, { useState } from 'react';
import { useScenario } from '@/context/ScenarioContext';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { sampleResponses } from '@/data/scenarios';

const NarrativeAssessment: React.FC = () => {
  const { isListening, setIsListening, userResponse, setUserResponse, setFeedback, setIsLoading } = useScenario();
  const [showPenguin, setShowPenguin] = useState(true);
  
  const handleStartRecording = () => {
    if (!isListening) {
      setIsListening(true);
      
      // Simulate microphone activity
      setTimeout(() => {
        // Using a sample response from the "storytelling" category
        const sampleResponse = sampleResponses["storytelling"][Math.floor(Math.random() * sampleResponses["storytelling"].length)];
        simulateTypingEffect(sampleResponse);
      }, 1000);
    }
  };
  
  const handleStopRecording = () => {
    setIsListening(false);
  };
  
  const simulateTypingEffect = (text: string) => {
    let index = 0;
    setUserResponse("");
    
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
  
  const handleSubmit = () => {
    if (!userResponse.trim()) return;
    
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate mock feedback
      setFeedback({
        articulation: 4,
        fluency: 4,
        vocabulary: 3,
        grammar: 3,
        communication: 4,
        empathy: 3,
        cooperation: 4,
        selfControl: 4,
        summary: "Great job telling your story!",
        suggestion: "Try using more descriptive words in your stories.",
        encouragement: "You're becoming a wonderful storyteller!",
        articulationFeedback: "Your words were very clear and easy to understand.",
        fluencyFeedback: "You spoke smoothly without many pauses.",
        vocabularyFeedback: "You used some good words, but could try using even more interesting words.",
        grammarFeedback: "Your sentences were mostly correct.",
        communicationFeedback: "You told your story in a way that was easy to follow.",
        empathyFeedback: "You showed some feelings in your story.",
        cooperationFeedback: "You followed the activity instructions well.",
        selfControlFeedback: "You stayed focused while telling your story."
      });
      
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative min-h-[300px] mb-8 bg-blue-50 rounded-xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-blue-200"></div>
        <div className="absolute bottom-20 left-0 w-full h-4 bg-blue-100"></div>
        
        {/* Penguin character */}
        {showPenguin && (
          <div className="penguinContainer absolute bottom-20 left-0 w-200px h-300px animate-waddle">
            <img 
              src="/penguin.png" 
              alt="Penguin character" 
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        )}
        
        {/* Speech bubble or prompt */}
        <div className="absolute top-4 right-4 max-w-[60%] bg-white p-4 rounded-2xl shadow-md">
          <p className="text-speech-dark">Tell me a story about a birthday party you remember!</p>
        </div>
      </div>
      
      <div className="w-full mb-6 bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-speech-dark mb-2">Your Story</h3>
        
        <div className="min-h-[100px] bg-gray-50 rounded-lg p-4 mb-4">
          {userResponse ? (
            <p className="text-speech-dark whitespace-pre-wrap">{userResponse}</p>
          ) : (
            <p className="text-speech-dark/40 italic">
              {isListening ? 'Listening...' : 'Click the microphone to start telling your story!'}
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-2">
            {!isListening ? (
              <Button
                onClick={handleStartRecording}
                className="bg-speech-purple hover:bg-speech-purple/80 flex items-center gap-2"
              >
                <Mic size={16} />
                <span>Start Recording</span>
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square size={16} />
                <span>Stop Recording</span>
              </Button>
            )}
          </div>
          
          {userResponse && !isListening && (
            <Button
              onClick={handleSubmit}
              className="bg-speech-green hover:bg-speech-green/80"
            >
              Submit Story
            </Button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes waddle {
          from { left: -220px; }
          to { left: 50%; transform: translateX(-50%); }
        }
        .animate-waddle {
          animation: waddle 2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
        }
      `}</style>
    </div>
  );
};

export default NarrativeAssessment;
