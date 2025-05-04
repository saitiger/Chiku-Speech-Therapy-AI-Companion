
import React from 'react';
import { Link } from 'react-router-dom';
import { GameCard as GameCardType } from '@/types';
import { Emoji } from 'lucide-react';

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
            <Emoji size={64} />
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
