
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
    <header className="w-full p-4 flex items-center justify-between bg-white shadow-sm rounded-b-xl">
      <div className="flex items-center gap-3">
        {activeScenario ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="hover:bg-blue-50"
          >
            <ArrowLeft className="text-speech-dark" size={24} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-50"
          >
            <Home className="text-speech-dark" size={24} />
          </Button>
        )}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/01ba70bd-660d-45af-9ef6-716a0689f339.png" 
            alt="Chiku" 
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-speech-blue to-speech-purple bg-clip-text text-transparent">
            Chiku
          </h1>
        </div>
      </div>
      
      {activeScenario && (
        <div className="bg-speech-light px-4 py-1 rounded-full shadow-sm">
          <h2 className="text-lg font-medium text-speech-dark">
            {activeScenario.title}
          </h2>
        </div>
      )}
    </header>
  );
};

export default Header;
