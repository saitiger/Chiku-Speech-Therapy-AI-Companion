import React, { useState, useEffect, useRef } from 'react';
import { useScenario } from '@/context/ScenarioContext';
import { ResponseOption, DifficultyLevelContent } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import CharacterBubble from '@/components/CharacterBubble';
import { convertSpeechToText } from '@/services/api';
interface InteractiveScenarioProps {
  scenarioContent: DifficultyLevelContent;
}
const InteractiveScenario: React.FC<InteractiveScenarioProps> = ({
  scenarioContent
}) => {
  const {
    currentStep,
    setCurrentStep,
    activeScenario,
    setFeedback,
    updateProgress
  } = useScenario();
  const [selectedResponse, setSelectedResponse] = useState<ResponseOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [customResponse, setCustomResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Get current exchange based on the step
  const currentExchange = scenarioContent?.dialogue.exchanges[currentStep - 1];

  // Reset state when scenario changes
  useEffect(() => {
    setCurrentStep(1);
    setSelectedResponse(null);
    setShowFeedback(false);
    setCompleted(false);
    setCustomResponse("");
  }, [scenarioContent, setCurrentStep]);
  if (!scenarioContent || !currentExchange) {
    return <div className="w-full p-8 text-center">
        <p className="text-speech-dark">This scenario is currently being prepared. Please try another activity!</p>
      </div>;
  }
  const handleSelectResponse = (response: ResponseOption) => {
    setSelectedResponse(response);
    setShowFeedback(true);
  };

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav'
        });

        // Process audio with speech-to-text API
        try {
          setIsProcessing(true);
          const transcribedText = await convertSpeechToText(audioBlob);
          if (transcribedText) {
            setCustomResponse(transcribedText);
            toast.success("Great response! Click 'Submit' to continue.");
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Could not understand your speech. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
      toast("Recording started...", {
        description: "Speak clearly and then click the button again to stop"
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access your microphone");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Release microphone access
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  const handleNextStep = () => {
    setSelectedResponse(null);
    setShowFeedback(false);
    setCustomResponse("");

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
      setCurrentStep(currentStep + 1);
    }
  };
  const handleSubmitCustomResponse = () => {
    if (customResponse.trim()) {
      // Find the most appropriate feedback - for now, just use the "Good" quality response
      const goodResponse = currentExchange.responseOptions.find(option => option.quality === "Good") || currentExchange.responseOptions[0];
      setSelectedResponse(goodResponse);
      setShowFeedback(true);
    } else {
      toast.error("Please record or select a response first");
    }
  };

  // Calculate the quality score based on the selected response quality
  const getQualityColor = () => {
    if (!selectedResponse) return "bg-gray-200";
    switch (selectedResponse.quality) {
      case "Excellent":
        return "bg-green-500";
      case "Good":
        return "bg-blue-500";
      case "Basic":
        return "bg-yellow-500";
      case "Needs Improvement":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return <div className="w-full">
      {/* Scene description */}
      <Card className="mb-6 bg-speech-light/50">
        
      </Card>
      
      {/* Character speech */}
      <div className="mb-6">
        <CharacterBubble character={{
        name: currentExchange.character,
        imageUrl: '/stella.png' // Default image, should be based on character
      }} message={currentExchange.text || "What would you say in this situation?"} />
      </div>
      
      {/* Visual support if available */}
      {currentExchange.visualSupport && <div className="mb-6 flex justify-center">
          <div className="bg-white p-2 rounded-lg shadow-md max-w-md">
            <img src="/story-image.png" // Placeholder for actual visual support
        alt="Visual support" className="w-full rounded" />
            <p className="text-xs text-center mt-1 text-speech-dark/70">
              {currentExchange.visualSupport}
            </p>
          </div>
        </div>}
      
      {/* Response options */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-speech-dark mb-3 flex items-center">
          <MessageSquare size={18} className="mr-2" />
          Your Response
        </h3>
        
        {!showFeedback && <>
            <div className="space-y-3 mb-4">
              {currentExchange.responseOptions.map((option, index) => <div key={index} className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedResponse === option ? 'border-2 border-speech-purple bg-speech-light/30' : 'border-gray-200 hover:border-speech-purple/50 hover:bg-speech-light/10'}`} onClick={() => !showFeedback && handleSelectResponse(option)}>
                  <p className="text-speech-dark">{option.text}</p>
                </div>)}
            </div>

            <div className="mt-6 p-4 bg-speech-light/20 rounded-lg">
              <h4 className="font-medium text-speech-dark mb-2">Or record your own response:</h4>
              
              <div className="flex items-center gap-3">
                <Button onClick={toggleRecording} className={`rounded-full p-3 w-12 h-12 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-speech-purple hover:bg-speech-purple/80'}`}>
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>
                
                <div className="flex-1">
                  {customResponse ? <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-speech-dark">{customResponse}</p>
                    </div> : <p className="text-speech-dark/70 text-sm">
                      {isRecording ? "Recording... Click the microphone again to stop" : "Click the microphone button and speak your response"}
                    </p>}
                </div>
              </div>
              
              {customResponse && <Button onClick={handleSubmitCustomResponse} className="mt-3 bg-speech-purple hover:bg-speech-purple/90" disabled={isProcessing}>
                  Submit My Response
                </Button>}
            </div>
          </>}
      </div>
      
      {/* Feedback when a response is selected */}
      {showFeedback && selectedResponse && <div className="mb-6">
          <Card className={`overflow-hidden`}>
            <div className={`h-2 ${getQualityColor()}`}></div>
            <CardContent className="p-4">
              <h4 className="font-bold text-speech-dark mb-1">{selectedResponse.quality}</h4>
              <p className="text-speech-dark/80">{selectedResponse.feedback}</p>
            </CardContent>
          </Card>
        </div>}
      
      {/* Next button */}
      {showFeedback && <div className="flex justify-end mb-6">
          <Button onClick={handleNextStep} className="bg-speech-purple hover:bg-speech-purple/90 flex items-center gap-2">
            {currentStep >= scenarioContent.dialogue.exchanges.length ? 'Complete' : 'Next'}
            <ArrowRight size={16} />
          </Button>
        </div>}
    </div>;
};
export default InteractiveScenario;