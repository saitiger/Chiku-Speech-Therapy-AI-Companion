
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from "@/components/ui/button";
import { Mic, Square, Play } from 'lucide-react';
import { useScenario } from '@/context/ScenarioContext';
import { convertSpeechToText } from '@/services/api';

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
  height: 300px;  /* Increased height for better appearance */
  animation: waddle 2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
  @keyframes waddle {
    from { left: -220px; }
    to { left: 50vw; }
  }
`;

const TextBubble = styled.div`
  position: absolute;
  top: 60px;
  left: 55vw;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 30px;
  border: 4px solid #222;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  padding: 28px 36px;
  font-size: 1.5rem;
  color: #333;
  min-width: 320px;
  max-width: 450px;
  z-index: 2;
`;

const NarrativeAssessment: React.FC = () => {
  const { setUserResponse, setIsLoading } = useScenario();
  const [showPenguin, setShowPenguin] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [childName, setChildName] = useState('Radhika');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Process audio with speech-to-text API
        try {
          setIsLoading(true);
          const transcribedText = await convertSpeechToText(audioBlob);
          if (transcribedText) {
            setUserResponse(transcribedText);
          }
        } catch (error) {
          console.error("Error processing audio:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
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

  // Play recorded audio
  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-50">
      <AntarcticBackdrop />
      
      {showPenguin && (
        <PenguinContainer>
          <img 
            src="/assets/mini-game-assets/frontend/public/penguin.png"
            alt="Penguin Character" 
            className="w-full h-full object-contain object-bottom"
          />
        </PenguinContainer>
      )}
      
      {showBubble && (
        <TextBubble>
          Hi, {childName} — Tell me about a birthday party you remember?
        </TextBubble>
      )}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {isRecording ? (
          <Button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center mb-4"
          >
            <Square size={24} />
          </Button>
        ) : recordedAudio ? (
          <div className="flex gap-4 mb-4">
            <Button
              onClick={playRecording}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center"
            >
              <Play size={24} />
            </Button>
            <Button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center"
            >
              <Mic size={24} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center mb-4"
          >
            <Mic size={24} />
          </Button>
        )}
        <p className="text-gray-700">
          {isRecording ? "Recording... Click to stop" : "Press to start recording"}
        </p>
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
