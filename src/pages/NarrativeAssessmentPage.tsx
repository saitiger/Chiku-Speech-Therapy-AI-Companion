
import React from 'react';
import { useScenario } from '@/context/ScenarioContext';
import { ScenarioProvider } from '@/context/ScenarioContext';
import NarrativeAssessment from '@/components/NarrativeAssessment';
import FeedbackDisplay from '@/components/FeedbackDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NarrativeAssessmentContent: React.FC = () => {
  const {
    feedback,
    resetScenario
  } = useScenario();
  const navigate = useNavigate();
  const handleBack = () => {
    resetScenario();
    navigate('/');
  };
  
  return (
    <main className="flex-1 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-4">
          <Button variant="ghost" className="flex items-center gap-2" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Button>
        </div>
        
        <div className="w-full mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-speech-dark mb-2">Tell me about a birthday party you remember</h1>
          <p className="text-speech-dark/80">The penguin is excited to hear your story!</p>
        </div>
        
        {feedback ? <FeedbackDisplay /> : <NarrativeAssessment />}
      </div>
    </main>
  );
};

// Important: We need to wrap the component with ScenarioProvider
const NarrativeAssessmentPage: React.FC = () => {
  return (
    <ScenarioProvider>
      <NarrativeAssessmentContent />
    </ScenarioProvider>
  );
};

export default NarrativeAssessmentPage;
