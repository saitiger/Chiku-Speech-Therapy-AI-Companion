
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, ArrowRight } from 'lucide-react';
import { useScenario } from '@/context/ScenarioContext';
import { convertSpeechToText, generateClaudeFeedback } from '@/services/api';
import { toast } from "sonner";

const AntarcticBackdrop = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(to top, #b3e5fc 0%, #fff 100%);
  position: fixed;
  z-index: 0;
  overflow: hidden;
`;

const PenguinContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 200px;
  height: 300px;
  animation: waddle 2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
  @keyframes waddle {
    from { left: -220px; }
    to { left: 50vw; }
  }
`;

const TextBubble = styled.div<{ isResponse?: boolean }>`
  position: absolute;
  top: 60px;
  left: 55vw;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 30px;
  border: 4px solid #222;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 28px 36px;
  font-size: 1.5rem;
  color: #333;
  min-width: 320px;
  max-width: 450px;
  z-index: 2;
  ${props => props.isResponse && `
    background: #e3f2fd;
    border-color: #2196f3;
  `}
`;

const StepIndicator = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
`;

// Step dialogue prompts
const stepDialogues = [
  "Hi there! Tell me about a birthday party you remember?",
  "That sounds fun! What was your favorite part of the birthday party?",
  "If you could plan your next birthday party, what would you want to do?"
];

const NarrativeAssessment: React.FC = () => {
  const { 
    setUserResponse, 
    userResponse,
    setIsLoading, 
    setFeedback,
    stepFeedback, 
    setStepFeedback,
    currentStep,
    totalSteps,
    advanceToNextStep
  } = useScenario();
  
  const [showPenguin, setShowPenguin] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [childName, setChildName] = useState('Friend');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [transcriptionInProgress, setTranscriptionInProgress] = useState(false);
  
  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  useEffect(() => {
    setTimeout(() => setShowPenguin(true), 400);
    setTimeout(() => setShowBubble(true), 2200);
  }, []);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Process audio with speech-to-text API
        try {
          setIsLoading(true);
          setTranscriptionInProgress(true);
          
          console.log("Sending audio for transcription, blob size:", audioBlob.size);
          const transcribedText = await convertSpeechToText(audioBlob);
          
          if (transcribedText) {
            setUserResponse(transcribedText);
            toast.success("Audio successfully transcribed!");
            
            // Now process the transcribed text with Claude
            processWithClaude(transcribedText);
          } else {
            toast.error("Could not transcribe audio. Please try again.");
            setIsLoading(false);
            setTranscriptionInProgress(false);
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Error processing audio. Please try again.");
          setIsLoading(false);
          setTranscriptionInProgress(false);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started. Speak clearly!");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  // Process transcribed text with Claude
  const processWithClaude = async (transcribedText: string) => {
    try {
      const scenarioContext = `Chiku Speech Assessment, Step ${currentStep} of ${totalSteps}: "${stepDialogues[currentStep-1]}"`;
      
      // Get feedback from Claude through the API
      const claudeFeedback = await generateClaudeFeedback(
        transcribedText, 
        scenarioContext,
        currentStep,
        totalSteps
      );
      
      if (currentStep === totalSteps) {
        // Final step - store complete evaluation
        setFeedback(claudeFeedback);
      } else {
        // Intermediate step - store step feedback
        setStepFeedback(claudeFeedback);
      }
    } catch (error) {
      console.error("Error processing with Claude:", error);
      toast.error("Error getting feedback. Using simulated feedback instead.");
    } finally {
      setIsLoading(false);
      setTranscriptionInProgress(false);
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Processing your recording...");
      
      // Release microphone access
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  // Handle continuing to the next step
  const handleNextStep = () => {
    advanceToNextStep();
    setRecordedAudio(null);
    setShowBubble(false);
    setTimeout(() => setShowBubble(true), 500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-50">
      <AntarcticBackdrop />
      
      <StepIndicator>
        Step {currentStep} of {totalSteps}
      </StepIndicator>
      
      {showPenguin && (
        <PenguinContainer>
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/lovable-uploads/01ba70bd-660d-45af-9ef6-716a0689f339.png" 
              alt="Chiku" 
              className="w-full h-full object-contain"
            />
          </div>
        </PenguinContainer>
      )}
      
      {showBubble && (
        <TextBubble>
          Hi, {childName} — {stepDialogues[currentStep - 1]}
        </TextBubble>
      )}
      
      {userResponse && stepFeedback && (
        <div className="absolute top-36 right-10 w-80 bg-white p-6 rounded-2xl shadow-lg z-10 border-2 border-speech-blue/20">
          <h3 className="font-bold text-speech-dark mb-3 text-lg">Feedback:</h3>
          <p className="text-gray-700 mb-4">{stepFeedback.feedback}</p>
          <p className="text-green-600 italic mb-2">{stepFeedback.encouragement}</p>
          <p className="text-speech-blue font-medium mb-4">{stepFeedback.nextStepTip}</p>
          
          <Button 
            onClick={handleNextStep} 
            className="mt-2 w-full flex items-center justify-center gap-2 bg-speech-purple hover:bg-speech-purple/90 transition-all rounded-xl py-2"
          >
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      )}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {isRecording ? (
          <Button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-lg transition-transform hover:scale-105"
            disabled={transcriptionInProgress}
          >
            <Square size={24} />
          </Button>
        ) : recordedAudio ? (
          <div className="flex gap-6 mb-4">
            <Button
              onClick={playRecording}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              disabled={transcriptionInProgress}
            >
              <Play size={24} />
            </Button>
            <Button
              onClick={startRecording}
              className="bg-speech-purple hover:bg-speech-purple/90 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              disabled={transcriptionInProgress}
            >
              <Mic size={24} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={startRecording}
            className="bg-speech-purple hover:bg-speech-purple/90 text-white rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-lg transition-transform hover:scale-105"
            disabled={transcriptionInProgress}
          >
            <Mic size={24} />
          </Button>
        )}
        <p className="text-speech-dark font-medium bg-white px-4 py-2 rounded-full shadow-sm">
          {isRecording ? "Recording... Click to stop" : 
           transcriptionInProgress ? "Processing..." :
           "Press to start recording"}
        </p>
        
        {userResponse && (
          <div className="mt-6 p-5 bg-white rounded-2xl shadow-md max-w-lg border-2 border-speech-blue/10">
            <h3 className="text-speech-dark font-medium mb-2">Your response:</h3>
            <p className="text-gray-700 italic">"{userResponse}"</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes waddle {
          from { left: -220px; }
          to { left: 50%; transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default NarrativeAssessment;
