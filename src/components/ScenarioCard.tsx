import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Scenario } from '@/types';
import { scenarioDetails } from '@/data/scenarios';
import { useScenario } from '@/context/ScenarioContext';
interface ScenarioCardProps {
  scenario: Scenario;
  onSelect?: () => void | Promise<void>; // Updated to allow for async function
}
const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onSelect
}) => {
  const {
    setActiveScenario
  } = useScenario();
  const handleCardClick = () => {
    const details = scenarioDetails[scenario.id];
    setActiveScenario(details);
    if (onSelect) {
      onSelect();
    }
  };
  return <Card className={`card-hover cursor-pointer w-full max-w-sm overflow-hidden ${scenario.backgroundClass}`} onClick={handleCardClick}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="text-5xl mb-4 animate-bounce-slow">{scenario.iconName}</div>
        <h3 className="text-xl font-bold mb-2 text-zinc-950">{scenario.title}</h3>
        <p className="text-zinc-950">{scenario.description}</p>
      </CardContent>
    </Card>;
};
export default ScenarioCard;