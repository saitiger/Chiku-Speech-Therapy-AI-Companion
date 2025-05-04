
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useScenario } from '@/context/ScenarioContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, Speech } from 'lucide-react';

const SkillScore: React.FC<{ label: string; score: number; feedback?: string }> = ({ label, score, feedback }) => {
  // Determine color based on score
  const getColorClass = () => {
    if (score >= 4) return "bg-speech-green";
    if (score >= 3) return "bg-speech-blue";
    return "bg-speech-purple";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-speech-dark">{label}</span>
        <span className="text-sm font-medium text-speech-dark">{score}/5</span>
      </div>
      <Progress value={score * 20} className={`h-2 ${getColorClass()}`} />
      {feedback && <p className="text-xs text-speech-dark/70 mt-1">{feedback}</p>}
    </div>
  );
};

const FeedbackDisplay: React.FC = () => {
  const { feedback, resetScenario, setActiveScenario } = useScenario();
  const [activeTab, setActiveTab] = useState<'language' | 'social'>('language');

  if (!feedback) return null;

  const handleBackToHome = () => {
    resetScenario();
    setActiveScenario(null);
  };

  const handleTryAgain = () => {
    resetScenario();
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg border-2 border-speech-purple/10 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-speech-purple to-speech-blue text-white">
          <CardTitle className="text-center">Speech Star Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Tab selection */}
          <div className="flex border-b border-speech-purple/10 mb-4">
            <button
              className={`flex-1 py-2 flex items-center justify-center gap-2 ${
                activeTab === 'language' 
                  ? 'border-b-2 border-speech-purple text-speech-purple font-medium' 
                  : 'text-speech-dark/60'
              }`}
              onClick={() => setActiveTab('language')}
            >
              <Book size={16} />
              <span>Speech & Language</span>
            </button>
            <button
              className={`flex-1 py-2 flex items-center justify-center gap-2 ${
                activeTab === 'social' 
                  ? 'border-b-2 border-speech-purple text-speech-purple font-medium' 
                  : 'text-speech-dark/60'
              }`}
              onClick={() => setActiveTab('social')}
            >
              <Speech size={16} />
              <span>Social Communication</span>
            </button>
          </div>
          
          {/* Skills scores based on active tab */}
          <div className="mb-6">
            {activeTab === 'language' ? (
              // Speech & Language Skills
              <>
                <SkillScore 
                  label="Articulation" 
                  score={feedback.articulation} 
                  feedback={feedback.articulationFeedback} 
                />
                <SkillScore 
                  label="Fluency" 
                  score={feedback.fluency} 
                  feedback={feedback.fluencyFeedback} 
                />
                <SkillScore 
                  label="Vocabulary" 
                  score={feedback.vocabulary} 
                  feedback={feedback.vocabularyFeedback} 
                />
                <SkillScore 
                  label="Grammar & Sentence Structure" 
                  score={feedback.grammar} 
                  feedback={feedback.grammarFeedback} 
                />
              </>
            ) : (
              // Social-Communication Skills
              <>
                <SkillScore 
                  label="Communication Clarity" 
                  score={feedback.communication} 
                  feedback={feedback.communicationFeedback} 
                />
                <SkillScore 
                  label="Empathy & Perspective Taking" 
                  score={feedback.empathy} 
                  feedback={feedback.empathyFeedback} 
                />
                <SkillScore 
                  label="Cooperation & Social Cues" 
                  score={feedback.cooperation} 
                  feedback={feedback.cooperationFeedback} 
                />
                <SkillScore 
                  label="Self-Control & Emotion Expression" 
                  score={feedback.selfControl} 
                  feedback={feedback.selfControlFeedback} 
                />
              </>
            )}
          </div>
          
          {/* Text feedback */}
          <div className="space-y-4 mt-6">
            <div>
              <h4 className="font-semibold text-speech-dark mb-2">Summary</h4>
              <p className="text-speech-dark">{feedback.summary}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-speech-dark mb-2">Tip for Next Time</h4>
              <p className="text-speech-dark">{feedback.suggestion}</p>
            </div>
            
            <div className="bg-speech-yellow/30 p-4 rounded-lg border border-speech-yellow">
              <h4 className="font-semibold text-speech-dark mb-2">Great Job!</h4>
              <p className="text-speech-dark">{feedback.encouragement}</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button 
              variant="outline" 
              className="flex-1 border-speech-purple text-speech-purple hover:bg-speech-purple/5" 
              onClick={handleBackToHome}
            >
              <ArrowLeft className="mr-1" size={16} />
              Back to Home
            </Button>
            <Button 
              className="flex-1 bg-speech-purple text-white hover:bg-speech-purple/90" 
              onClick={handleTryAgain}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackDisplay;
