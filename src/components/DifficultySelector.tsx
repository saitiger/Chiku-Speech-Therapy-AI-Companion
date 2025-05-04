
import React from 'react';
import { useScenario } from '@/context/ScenarioContext';
import { DifficultyLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const DifficultySelector: React.FC = () => {
  const { selectedDifficulty, setSelectedDifficulty } = useScenario();
  
  const difficultyLevels: { 
    level: DifficultyLevel; 
    title: string; 
    description: string;
    color: string;
  }[] = [
    {
      level: 'beginner',
      title: 'Beginner',
      description: 'Simple sentences, heavy visual cues, basic responses',
      color: 'bg-green-500'
    },
    {
      level: 'intermediate',
      title: 'Intermediate',
      description: 'Complete sentences, some visual cues, proper responses',
      color: 'bg-blue-500'
    },
    {
      level: 'advanced',
      title: 'Advanced',
      description: 'Complex sentences, minimal visual cues, elaborate answers',
      color: 'bg-purple-500'
    }
  ];
  
  return (
    <div className="w-full mb-6">
      <h3 className="text-lg font-medium text-speech-dark mb-3">Select Difficulty Level</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficultyLevels.map((level) => (
          <Card 
            key={level.level}
            className={`cursor-pointer transition-all ${
              selectedDifficulty === level.level 
                ? 'border-2 border-speech-purple shadow-md transform scale-[1.02]' 
                : 'border border-gray-200'
            }`}
            onClick={() => setSelectedDifficulty(level.level)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-speech-dark">{level.title}</h4>
                {selectedDifficulty === level.level && (
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-speech-purple text-white">
                    <Check size={14} />
                  </div>
                )}
              </div>
              <div className={`w-full h-2 ${level.color} rounded-full mb-2`}></div>
              <p className="text-sm text-speech-dark/70">{level.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
