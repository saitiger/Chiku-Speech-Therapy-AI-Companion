
import React from 'react';
import { Link } from 'react-router-dom';
import { GameCard as GameCardType } from '@/types';

interface GameCardProps {
  game: GameCardType;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link to={game.path} className="block">
      <div 
        className={`rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg hover:scale-[1.02] ${game.backgroundColor}`}
      >
        <div className="aspect-[16/9] overflow-hidden flex items-center justify-center">
          {game.imagePath ? (
            <img 
              src={game.imagePath} 
              alt={game.title} 
              className="w-full h-full object-cover"
            />
          ) : game.emoji ? (
            <span className="text-7xl">{game.emoji}</span>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <span className="text-gray-400 text-lg">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-speech-dark">{game.title}</h3>
          <p className="text-speech-dark/70 text-sm mt-1">{game.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
