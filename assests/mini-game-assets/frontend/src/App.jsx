import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import Lottie from 'lottie-react';
// TODO: Add penguin Lottie JSON
// import penguinData from './penguin.json';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
    background: linear-gradient(to top, #e0f7fa 0%, #fff 100%);
    min-height: 100vh;
  }
`;

const AntarcticBackdrop = styled.div`
  width: 100vw;
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
  height: 200px;
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

const RecordButton = styled.button`
  position: absolute;
  bottom: 36px;
  left: 50vw;
  transform: translateX(-50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #f44336;
  border: 6px solid #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:active {
    background: #d32f2f;
  }
`;

const MicIcon = styled.span`
  color: #fff;
  font-size: 2.5rem;
`;

// Result Score Box component
const ScoreBox = styled.div`
  background-color: ${props => props.color || '#f5f5f5'};
  border-radius: 12px;
  padding: 18px;
  margin: 10px;
  width: 200px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
  color: white;
  font-size: 1.2rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.4rem;
  }
  
  p {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  }
`;

const ScoreGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to top, #e0f7fa 0%, #fff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  z-index: 10;
  
  h2 {
    color: #333;
    margin-bottom: 30px;
    font-size: 2rem;
  }
  
  .total-score {
    background: linear-gradient(to bottom right, #6a11cb, #2575fc);
    padding: 15px 30px;
    border-radius: 16px;
    margin: 30px 0;
    text-align: center;
    
    h3 {
      color: white;
      margin: 0 0 8px 0;
    }
    
    p {
      color: white;
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0;
    }
  }
`;

const RecordingIndicator = styled.div`
  position: absolute;
  bottom: 140px;
  left: 50vw;
  transform: translateX(-50%);
  color: #f44336;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #f44336;
    margin-right: 8px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: #2575fc;
  animation: spin 1s ease-in-out infinite;
  margin: 20px auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function App() {
  const [recording, setRecording] = useState(false);
  const [childName, setChildName] = useState('Sammy');
  const [showPenguin, setShowPenguin] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('intro'); // intro, recording, results
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  useEffect(() => {
    if (stage === 'intro') {
      setTimeout(() => setShowPenguin(true), 400);
      setTimeout(() => setShowBubble(true), 2200);
    }
  }, [stage]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check if the browser supports audio/mpeg (MP3) format
      const mimeType = MediaRecorder.isTypeSupported('audio/mpeg') ? 'audio/mpeg' : 'audio/webm';
      console.log(`Using MIME type: ${mimeType} for recording`);
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        // Explicitly use a format supported by Groq's Whisper API
        // audio/mp3, audio/mp4, audio/mpeg, audio/mpga, audio/m4a, audio/wav, etc.
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Upload recording for transcription and assessment
        uploadRecording(audioBlob);
      });
      
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access your microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const uploadRecording = async (audioBlob) => {
    setLoading(true);
    
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send to server for transcription
      const transcriptResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!transcriptResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const transcriptData = await transcriptResponse.json();
      setTranscript(transcriptData.transcript);
      
      // Send transcript for assessment
      const assessResponse = await fetch('/api/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptData.transcript }),
      });
      
      if (!assessResponse.ok) {
        throw new Error('Failed to assess narrative');
      }
      
      const assessData = await assessResponse.json();
      setAssessmentResults(assessData.scores);
      setStage('results');
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('There was an error processing your recording. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRecord = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const getScoreColor = (category, score) => {
    if (category === 'coherence') {
      // Coherence is scored 0-4
      if (score >= 3) return '#4CAF50'; // Green
      if (score >= 2) return '#8BC34A'; // Light Green
      if (score >= 1) return '#FFC107'; // Yellow
      return '#F44336'; // Red
    } else {
      // Other categories are scored 0-2
      if (score === 2) return '#4CAF50'; // Green
      if (score === 1) return '#FFC107'; // Yellow
      return '#F44336'; // Red
    }
  };
  
  const getInterpretationColor = (interpretation) => {
    if (interpretation.includes('Advanced')) return '#4CAF50';
    if (interpretation.includes('Age-appropriate')) return '#8BC34A';
    if (interpretation.includes('Emerging')) return '#FFC107';
    return '#F44336';
  };
  
  return (
    <>
      <GlobalStyle />
      
      {stage === 'results' && assessmentResults && (
        <ResultsContainer>
          <h2>Narrative Assessment Results</h2>
          
          <div className="total-score">
            <h3>Total Score</h3>
            <p>{assessmentResults.total}/16</p>
          </div>
          
          <ScoreGrid>
            <ScoreBox color={getScoreColor('setting', assessmentResults.setting)}>
              <h3>Setting</h3>
              <p>{assessmentResults.setting}/2</p>
            </ScoreBox>
            
            <ScoreBox color={getScoreColor('characters', assessmentResults.characters)}>
              <h3>Characters</h3>
              <p>{assessmentResults.characters}/2</p>
            </ScoreBox>
            
            <ScoreBox color={getScoreColor('sequence', assessmentResults.sequence)}>
              <h3>Sequence</h3>
              <p>{assessmentResults.sequence}/2</p>
            </ScoreBox>
            
            <ScoreBox color={getScoreColor('connectives', assessmentResults.connectives)}>
              <h3>Connectives</h3>
              <p>{assessmentResults.connectives}/2</p>
            </ScoreBox>
            
            <ScoreBox color={getScoreColor('descriptiveLanguage', assessmentResults.descriptiveLanguage)}>
              <h3>Description</h3>
              <p>{assessmentResults.descriptiveLanguage}/2</p>
            </ScoreBox>
            
            <ScoreBox color={getScoreColor('emotionalContent', assessmentResults.emotionalContent)}>
              <h3>Emotional</h3>
              <p>{assessmentResults.emotionalContent}/2</p>
            </ScoreBox>
            
            <ScoreBox color={getScoreColor('coherence', assessmentResults.coherence)}>
              <h3>Coherence</h3>
              <p>{assessmentResults.coherence}/4</p>
            </ScoreBox>
          </ScoreGrid>
          
          <ScoreBox 
            color={getInterpretationColor(assessmentResults.interpretation)}
            style={{ width: '80%', maxWidth: '500px', marginTop: '30px' }}
          >
            <h3>Interpretation</h3>
            <p style={{ fontSize: '1.5rem' }}>{assessmentResults.interpretation}</p>
          </ScoreBox>
          
          <button 
            onClick={() => setStage('intro')}
            style={{ 
              marginTop: '40px', 
              padding: '12px 24px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </ResultsContainer>
      )}
      
      {stage === 'intro' && (
        <>
          <AntarcticBackdrop />
          {showPenguin && (
            <PenguinContainer>
              {/* <Lottie animationData={penguinData} loop={false} /> */}
              <img src="/penguin.png" alt="Penguin" style={{ width: '100%', height: '100%' }} />
            </PenguinContainer>
          )}
          {showBubble && (
            <TextBubble>
              Hi, {childName} — Tell me about a birthday party you remember?
            </TextBubble>
          )}
          {recording && <RecordingIndicator>Recording...</RecordingIndicator>}
          {loading && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <LoadingSpinner />
              <p>Processing your story...</p>
            </div>
          )}
          <RecordButton 
            onClick={handleRecord} 
            aria-label={recording ? "Stop Recording" : "Start Recording"}
            $recording={recording}
          >
            <MicIcon role="img">{recording ? '⏹️' : '🎤'}</MicIcon>
          </RecordButton>
        </>
      )}
    </>
  );
}
