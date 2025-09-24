import { NewCognitiveTaskCard } from '@/components/dashboard/new-cognitive-task-card';
import { NewRiskScoreCard } from '@/components/dashboard/new-risk-score-card';
import { NewSpeechAnalysisCard } from '@/components/dashboard/new-speech-analysis-card';

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewSpeechAnalysisCard />
      <NewCognitiveTaskCard />
      <NewRiskScoreCard />
    </div>
  );
}
