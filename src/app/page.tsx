'use client';

import { useState } from 'react';
import { NewCognitiveTaskCard } from '@/components/dashboard/new-cognitive-task-card';
import { NewRiskScoreCard } from '@/components/dashboard/new-risk-score-card';
import { NewSpeechAnalysisCard } from '@/components/dashboard/new-speech-analysis-card';
import type { SpeechAnalysisResult } from '@/app/actions';

export default function Home() {
  const [speechAnalysis, setSpeechAnalysis] = useState<
    SpeechAnalysisResult['data'] | null
  >(null);
  const [cognitivePerformance, setCognitivePerformance] = useState<string | null>(
    null
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <NewSpeechAnalysisCard onAnalysisComplete={setSpeechAnalysis} />
      <NewCognitiveTaskCard onAnalysisComplete={setCognitivePerformance} />
      <NewRiskScoreCard
        speechAnalysis={speechAnalysis}
        cognitivePerformance={cognitivePerformance}
      />
    </div>
  );
}
