import { CognitiveTasksCard } from '@/components/dashboard/cognitive-tasks-card';
import { PerformanceChartCard } from '@/components/dashboard/performance-chart-card';
import { RiskScoreCard } from '@/components/dashboard/risk-score-card';
import { SpeechAnalysisCard } from '@/components/dashboard/speech-analysis-card';
import { WelcomeCard } from '@/components/dashboard/welcome-card';

export default function Home() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CognitiveTasksCard />
          <PerformanceChartCard />
        </div>
        <div className="space-y-6">
          <RiskScoreCard />
          <SpeechAnalysisCard />
        </div>
      </div>
    </div>
  );
}
