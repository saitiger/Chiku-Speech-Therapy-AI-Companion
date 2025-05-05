
import React from 'react';
import { ScenarioProvider } from '@/context/ScenarioContext';
import { useScenario } from '@/context/ScenarioContext';
import Header from '@/components/Header';
import HomePage from '@/pages/HomePage';
import ScenarioPage from '@/pages/ScenarioPage';

const AppContent: React.FC = () => {
  const { activeScenario } = useScenario();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-speech-light">
      <Header />
      <main className="flex-1 flex flex-col items-center py-6 px-4 md:px-6">
        {activeScenario ? <ScenarioPage /> : <HomePage />}
      </main>
      <footer className="py-4 px-6 text-center text-sm text-speech-dark/60 bg-white shadow-inner">
        <p className="font-nunito">Chiku - Helping children practice speech skills through fun activities!</p>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ScenarioProvider>
      <AppContent />
    </ScenarioProvider>
  );
};

export default Index;
