
import React from 'react';
import { Button } from '@/components/ui/button';
import { useScenario } from '@/context/ScenarioContext';
import { ArrowLeft, Home } from 'lucide-react';

const Header: React.FC = () => {
  const { activeScenario, setActiveScenario, resetScenario } = useScenario();
  
  const handleBackClick = () => {
    if (activeScenario) {
      resetScenario();
      setActiveScenario(null);
    }
  };
  
  return (
    <header className="w-full p-4 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-2">
        {activeScenario ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
          >
            <ArrowLeft className="text-speech-dark" size={24} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
          >
            <Home className="text-speech-dark" size={24} />
          </Button>
        )}
        <h1 className="text-xl font-bold text-speech-purple">
          Speech Stars <span className="text-speech-blue">Playtime Pal</span>
        </h1>
      </div>
      
      {activeScenario && (
        <div>
          <h2 className="text-lg font-medium text-speech-dark">
            {activeScenario.title}
          </h2>
        </div>
      )}
    </header>
  );
};

export default Header;
