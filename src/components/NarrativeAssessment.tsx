
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from "@/components/ui/button";

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

const NarrativeAssessment: React.FC = () => {
  const [showPenguin, setShowPenguin] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [childName, setChildName] = useState('Radhika');
  
  useEffect(() => {
    setTimeout(() => setShowPenguin(true), 400);
    setTimeout(() => setShowBubble(true), 2200);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-50">
      <AntarcticBackdrop />
      
      {showPenguin && (
        <PenguinContainer>
          <img 
            src="/assests/mini-game-assets/frontend/src/penguin.png"
            alt="Penguin Character" 
            className="w-full h-full object-contain"
          />
        </PenguinContainer>
      )}
      
      {showBubble && (
        <TextBubble>
          Hi, {childName} — Tell me about a birthday party you remember?
        </TextBubble>
      )}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <Button
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center mb-4"
        >
          <span className="text-3xl">🎤</span>
        </Button>
        <p className="text-gray-700">Press to start recording</p>
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
