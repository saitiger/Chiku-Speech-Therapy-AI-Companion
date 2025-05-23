
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useScenario } from '@/context/ScenarioContext';
import { generateClaudeFeedback, convertSpeechToText } from '@/services/api';
import { sampleResponses } from '@/data/scenarios';
import { Mic, MicOff, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';

const ResponseInput: React.FC = () => {
  const { 
    activeScenario, 
    userResponse, 
    setUserResponse, 
    setFeedback, 
    isListening,
    setIsListening,
    isLoading,
    setIsLoading,
    simulateVoiceInput
  } = useScenario();
  
  const [showExamples, setShowExamples] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [enhancedText, setEnhancedText] = useState<string>('');
  const [speechPatterns, setSpeechPatterns] = useState<any>(null);
  const [showEnhanced, setShowEnhanced] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const supabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserResponse(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!activeScenario || !userResponse.trim()) {
      toast.error("Please provide a response before submitting");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const scenarioContext = `${activeScenario.instruction} ${activeScenario.prompt}`;
      const feedbackResponse = await generateClaudeFeedback(userResponse, scenarioContext);
      setFeedback(feedbackResponse);
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const startRecording = async () => {
    try {
      // Check if browser supports MediaRecorder
      if (!window.MediaRecorder) {
        toast.error("Your browser doesn't support voice recording");
        return;
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Event handler for when data is available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Audio data received, size:", event.data.size);
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);
      
      toast("Recording started", {
        description: "Speak clearly into your microphone"
      });
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access your microphone");
      
      // If we can't access the microphone and Supabase isn't configured,
      // fall back to the example responses
      if (!supabaseConfigured) {
        setShowExamples(!showExamples);
      }
    }
  };
  
  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop the media recorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Handle the recorded audio when recording stops
      mediaRecorderRef.current.onstop = async () => {
        try {
          toast("Processing your speech...");
          
          // Create a blob from the audio chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log("Audio blob created, size:", audioBlob.size);
          
          if (supabaseConfigured) {
            // Convert speech to text using Groq Whisper API via Supabase Edge Function
            setIsLoading(true);
            
            // Use the updated function that returns enhanced text and speech patterns
            const transcriptionResult = await convertSpeechToText(audioBlob);
            setIsLoading(false);
            
            if (transcriptionResult.text) {
              setUserResponse(transcriptionResult.text);
              setEnhancedText(transcriptionResult.enhancedText || transcriptionResult.text);
              setSpeechPatterns(transcriptionResult.speechPatterns);
              toast.success("Speech converted to text");
              console.log("Transcribed text:", transcriptionResult.text);
              
              if (transcriptionResult.enhancedText !== transcriptionResult.text) {
                toast.info("Speech patterns detected", {
                  description: "View the enhanced transcript for more details"
                });
              }
            } else {
              toast.error("Could not transcribe your speech. Please try again or type your response.");
            }
          } else {
            // If Supabase is not configured, show examples instead
            toast("Voice recognition requires Supabase setup", {
              description: "Select an example response instead"
            });
            setShowExamples(true);
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          toast.error("Error processing your speech");
        } finally {
          setIsListening(false);
        }
        
        // Stop all tracks on the stream
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  };
  
  const toggleMicrophone = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (supabaseConfigured) {
        startRecording();
      } else {
        // If Supabase isn't configured, show a toast explaining the simulation
        toast("Voice recording simulated", {
          description: "Click an example response to see it in action"
        });
        setShowExamples(!showExamples);
      }
    }
  };
  
  const selectExampleResponse = (response: string) => {
    simulateVoiceInput(response);
    setShowExamples(false);
  };
  
  // Toggle between original and enhanced transcript
  const toggleTranscriptView = () => {
    setShowEnhanced(!showEnhanced);
  };
  
  // Render speech patterns information
  const renderSpeechPatterns = () => {
    if (!speechPatterns) return null;
    
    const { pauses } = speechPatterns;
    
    return (
      <div className="mt-3 p-3 bg-blue-50 rounded-xl text-sm text-gray-700">
        <h4 className="font-medium text-speech-dark mb-2">Speech Pattern Analysis:</h4>
        {pauses && pauses.length > 0 ? (
          <div>
            <p>Detected {pauses.length} significant pauses:</p>
            <ul className="list-disc pl-5 mt-1">
              {pauses.map((pause: any, index: number) => (
                <li key={index}>
                  {pause.duration.toFixed(1)}s pause at {pause.start.toFixed(1)}s
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No significant speech patterns detected.</p>
        )}
      </div>
    );
  };
  
  if (!activeScenario) return null;
  
  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Textarea
          placeholder="Type your response here or press the microphone button to speak..."
          value={showEnhanced && enhancedText ? enhancedText : userResponse}
          onChange={handleInputChange}
          className="min-h-[120px] text-speech-dark p-4 pr-12 rounded-xl border-2 border-speech-purple/20 focus:border-speech-purple"
          disabled={isListening || isLoading}
        />
        
        {enhancedText && enhancedText !== userResponse && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-12 bottom-2 text-speech-blue"
            onClick={toggleTranscriptView}
            disabled={isLoading}
          >
            <Eye size={20} />
          </Button>
        )}
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={`absolute right-2 bottom-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-speech-purple'}`}
          onClick={toggleMicrophone}
          disabled={isLoading}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
        </Button>
      </div>

      {enhancedText && enhancedText !== userResponse && showEnhanced && speechPatterns && renderSpeechPatterns()}

      {showExamples && activeScenario.id in sampleResponses && (
        <div className="mt-3 bg-white rounded-xl p-3 border border-speech-purple/20 shadow-sm">
          <p className="text-sm font-medium text-speech-dark mb-2">Example responses (click one to simulate):</p>
          <div className="space-y-2">
            {sampleResponses[activeScenario.id].map((response, index) => (
              <div 
                key={index} 
                className="p-2 bg-speech-light rounded-lg cursor-pointer hover:bg-speech-yellow/30 transition-colors"
                onClick={() => selectExampleResponse(response)}
              >
                <p className="text-sm text-speech-dark">{response}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={isListening || isLoading || !userResponse.trim()}
          className="btn-accent flex items-center gap-2"
        >
          <span>Submit Response</span>
          <Check size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ResponseInput;
