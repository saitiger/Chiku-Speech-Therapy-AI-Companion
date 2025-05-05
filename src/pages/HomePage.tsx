import React from 'react';
import { Scenario } from '@/types';
import ScenarioCard from '@/components/ScenarioCard';
import { useScenario } from '@/context/ScenarioContext';
import { scenarios } from '@/data/scenarios';
import GameCard from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { BarChart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
const games = [{
  id: 'narrative-assessment',
  title: 'Penguin Story Time',
  description: 'Help the penguin by telling a story about a birthday party!',
  imagePath: '',
  // Removed image path to use emoji instead
  emoji: '🐧',
  // Added emoji instead of using an image
  path: '/narrative-assessment',
  backgroundColor: 'bg-gradient-to-br from-blue-100 to-blue-50'
}];
const HomePage: React.FC = () => {
  const {
    setActiveScenario,
    progressData
  } = useScenario();
  const navigate = useNavigate();
  const handleSelectScenario = async (scenario: Scenario) => {
    try {
      if (scenario.id === "cafe") {
        // Special handling for cafe scenario to use the demo
        const {
          scenarioDetails
        } = await import('@/data/scenarios');
        setActiveScenario(scenarioDetails[scenario.id]);
      } else {
        // For other scenarios, try to get from JSON file first
        const response = await fetch(`/data/scenario-${scenario.id}.json`);
        if (!response.ok) {
          // If no JSON file exists, use the hardcoded details from scenarios.ts
          const {
            scenarioDetails
          } = await import('@/data/scenarios');
          setActiveScenario(scenarioDetails[scenario.id]);
        } else {
          const scenarioDetails = await response.json();
          setActiveScenario(scenarioDetails);
        }
      }

      // Navigate to scenario page
      navigate('/scenario');
    } catch (error) {
      console.error('Error loading scenario:', error);
      // Fall back to hardcoded scenarios
      const {
        scenarioDetails
      } = await import('@/data/scenarios');
      setActiveScenario(scenarioDetails[scenario.id]);
      navigate('/scenario');
    }
  };
  return <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-speech-light">
      <Header />
      
      <main className="flex-1 px-4 py-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-speech-dark">
              Speech Stars Playtime
            </h1>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2 border-speech-purple text-speech-purple hover:bg-speech-purple/5" onClick={() => navigate('/progress')}>
                <BarChart size={16} />
                <span className="hidden sm:inline">Progress</span>
              </Button>
              
              <Button variant="ghost" className="flex items-center gap-2 text-speech-dark/70" onClick={() => {/* Open settings modal */}}>
                <Settings size={16} />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
          
          {/* Welcome message */}
          <div className="bg-gradient-to-r from-speech-purple to-speech-blue rounded-xl p-6 mb-8 text-white shadow-md">
            <h2 className="text-xl font-bold mb-2">Welcome back, Radhika!</h2>
            <p>Continue practicing your speech skills with fun activities and games.</p>
          </div>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-speech-dark mb-6">Games</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {games.map(game => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-speech-dark mb-6">Social Scenarios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {scenarios.map(scenario => <ScenarioCard key={scenario.id} scenario={scenario} onSelect={() => handleSelectScenario(scenario)} />)}
            </div>
          </section>
        </div>
      </main>
      
      
    </div>;
};
export default HomePage;