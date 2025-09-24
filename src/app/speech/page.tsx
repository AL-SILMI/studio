import { SpeechAnalysisTool } from '@/components/speech/speech-analysis-tool';

export default function SpeechAnalysisPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Speech Analysis</h1>
        <p className="text-muted-foreground">
          Use your microphone to record a short passage and have it analyzed by our AI.
        </p>
      </div>
      <SpeechAnalysisTool />
    </div>
  );
}
