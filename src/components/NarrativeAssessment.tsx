
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useScenario } from '@/context/ScenarioContext';
import { convertSpeechToText, generateClaudeFeedback } from '@/services/api';
import { Button } from '@/components/ui/button';
import styled from 'styled-components';

// Import penguin fix styles from assets
const PenguinContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 200px;
  height: 300px;  /* Increased from 200px to 300px for greater height */
  animation: waddle 2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
  @keyframes waddle {
    from { left: -220px; }
    to { left: 50vw; }
  }
`;

const NarrativeAssessment: React.FC = () => {
  // State variables
  const [penguinPosition, setPenguinPosition] = useState(-100); // Start offscreen
  const [showQuestion, setShowQuestion] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [showPenguin, setShowPenguin] = useState(false);
  
  // Get scenario context
  const { 
    setIsLoading, 
    setUserResponse, 
    setFeedback, 
    isLoading, 
    progressData 
  } = useScenario();
  
  // Get user name from progress data
  const childName = progressData.settings.userName || "Friend";
  
  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  
  // Animate penguin walking in
  useEffect(() => {
    const walkIn = setTimeout(() => {
      setShowPenguin(true);
      const animation = setInterval(() => {
        setPenguinPosition(prev => {
          if (prev >= 100) {
            clearInterval(animation);
            setShowQuestion(true); // Show the question once penguin is center
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }, 1000); // Short delay before penguin starts walking
    
    return () => {
      clearTimeout(walkIn);
    };
  }, []);
  
  // Recording functions
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
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        audioUrlRef.current = audioUrl;
        
        // Process the audio with the Groq Whisper API
        processAudioWithAI(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started! Tell us about a birthday party you remember.");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check your permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording finished!");
    }
  };
  
  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };
  
  // Process the recording with Groq Whisper API and Claude
  const processAudioWithAI = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      // Step 1: Convert audio to text using Groq Whisper API
      const transcribedText = await convertSpeechToText(audioBlob);
      
      if (!transcribedText) {
        toast.error("Couldn't understand the speech. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // Set the transcribed text as user response
      setUserResponse(transcribedText);
      
      // Step 2: Evaluate the transcribed text with Claude API
      const scenarioContext = "The child was asked to tell a story about a birthday party they remember. This is a narrative development assessment.";
      const feedbackResponse = await generateClaudeFeedback(transcribedText, scenarioContext);
      
      // Set the feedback in the context
      setFeedback(feedbackResponse);
      setIsLoading(false);
      
      // Navigate to feedback display (handled by parent component)
      
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Error processing your response. Please try again.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative overflow-hidden bg-blue-100 rounded-xl">
      {/* Antarctic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-50">
        {/* Snow-capped mountains */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1200 300" className="w-full">
            <path d="M0,300 L300,100 L400,200 L600,50 L800,150 L1000,80 L1200,250 L1200,300 L0,300 Z" fill="#f8fafc" />
            <path d="M0,300 L200,180 L350,240 L500,140 L700,200 L900,120 L1100,220 L1200,300 L0,300 Z" fill="white" />
          </svg>
        </div>
        
        {/* Snow particles */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full w-2 h-2"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `fall ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Penguin character - updated with styled component */}
      {showPenguin && (
        <PenguinContainer>
          <img 
            src="/penguin.png" 
            alt="Penguin" 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'contain',  /* This ensures the image maintains its aspect ratio */
              objectPosition: 'bottom'  /* This anchors the image to the bottom of the container */
            }} 
          />
        </PenguinContainer>
      )}
      
      {/* Speech bubble question */}
      {showQuestion && (
        <div className="absolute top-16 md:top-24 left-1/2 transform -translate-x-1/2 bg-white p-4 md:p-6 rounded-xl border-4 border-blue-400 w-64 md:w-80">
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 rotate-45 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-400"></div>
          <p className="text-lg md:text-xl font-semibold text-center text-speech-dark">
            Hi, {childName}! Tell me about a birthday party you remember?
          </p>
        </div>
      )}
      
      {/* Recording controls */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center items-center gap-4">
        {isRecording ? (
          <Button 
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="rounded-full p-3 md:p-4 h-auto"
            disabled={isLoading}
          >
            <Square size={28} />
          </Button>
        ) : recordedAudio ? (
          <div className="flex gap-4">
            <Button 
              onClick={playRecording}
              size="lg"
              variant="default"
              className="rounded-full p-3 md:p-4 h-auto bg-green-500 hover:bg-green-600"
              disabled={isLoading}
            >
              <Play size={28} />
            </Button>
            <Button 
              onClick={startRecording}
              size="lg"
              variant="destructive"
              className="rounded-full p-3 md:p-4 h-auto"
              disabled={isLoading}
            >
              <Mic size={28} />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={startRecording}
            size="lg"
            variant="destructive"
            className="rounded-full p-3 md:p-4 h-auto"
            disabled={isLoading}
          >
            <Mic size={28} />
          </Button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-12 h-12 border-4 border-speech-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-speech-dark font-semibold">Processing your story...</p>
        </div>
      )}
    </div>
  );
};

export default NarrativeAssessment;
