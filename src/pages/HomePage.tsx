
import React from 'react';
import { Scenario } from '@/types';
import ScenarioCard from '@/components/ScenarioCard';
import { useScenario } from '@/context/ScenarioContext';
import { scenarios } from '@/data/scenarios';
import GameCard from '@/components/GameCard';

const games = [
  {
    id: 'narrative-assessment',
    title: 'Penguin Story Time',
    description: 'Help the penguin by telling a story about a birthday party!',
    imagePath: '/placeholder.svg', // You can replace this with a penguin image
    path: '/narrative-assessment',
    backgroundColor: 'bg-gradient-to-br from-blue-100 to-blue-50'
  }
];

const HomePage: React.FC = () => {
  const { setActiveScenario } = useScenario();
  
  const handleSelectScenario = async (scenario: Scenario) => {
    try {
      // Fetch scenario details
      const response = await fetch(`/data/scenario-${scenario.id}.json`);
      if (!response.ok) throw new Error('Failed to load scenario');
      
      const scenarioDetails = await response.json();
      setActiveScenario(scenarioDetails);
    } catch (error) {
      console.error('Error loading scenario:', error);
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-speech-dark mb-6">Speech Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-speech-dark mb-6">Social Scenarios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {scenarios.map(scenario => (
            <ScenarioCard 
              key={scenario.id}
              scenario={scenario}
              onSelect={() => handleSelectScenario(scenario)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
