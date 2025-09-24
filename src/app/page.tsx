import { NewCognitiveTaskCard } from '@/components/dashboard/new-cognitive-task-card';
import { NewRiskScoreCard } from '@/components/dashboard/new-risk-score-card';
import { NewSpeechAnalysisCard } from '@/components/dashboard/new-speech-analysis-card';

export default function Home() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <NewSpeechAnalysisCard />
      <NewCognitiveTaskCard />
      <NewRiskScoreCard />
    </div>
  );
}
