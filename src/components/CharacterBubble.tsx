
import React from 'react';
import { Character } from '@/types';

interface CharacterBubbleProps {
  character: Character;
  message: string;
}

const CharacterBubble: React.FC<CharacterBubbleProps> = ({ character, message }) => {
  return (
    <div className="flex items-end mb-8">
      <div className="w-16 h-16 rounded-full bg-speech-purple flex items-center justify-center mr-3 animate-bounce-slow">
        <span className="text-2xl">{character.name.charAt(0)}</span>
      </div>
      <div className="bg-white p-4 rounded-t-2xl rounded-br-2xl shadow-md max-w-md">
        <p className="font-medium text-speech-dark">{message}</p>
      </div>
    </div>
  );
};

export default CharacterBubble;
