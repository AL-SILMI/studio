'use server';

import {
  generateDementiaRiskScore,
  type GenerateDementiaRiskScoreOutput,
} from '@/ai/flows/generate-dementia-risk-score';
import {
  analyzeSpeechForCognitiveDecline,
  type SpeechAnalysisForCognitiveDeclineOutput,
} from '@/ai/flows/speech-analysis-for-cognitive-decline';
import {
  analyzeCognitiveTaskPerformance,
  type AnalyzeCognitiveTaskPerformanceOutput,
} from '@/ai/flows/analyze-cognitive-task-performance';


export type RiskScoreResult =
  | { success: true; data: GenerateDementiaRiskScoreOutput }
  | { success: false; error: string };

export async function getRiskScore(
  cognitiveTaskPerformance: string,
  speechPatterns: string,
  behavioralData: string
): Promise<RiskScoreResult> {
  try {
    const result = await generateDementiaRiskScore({
      cognitiveTaskPerformance,
      speechPatterns,
      behavioralData,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating risk score:', error);
    return { success: false, error: 'An unexpected error occurred while generating the risk score. Please try again later.' };
  }
}

export type SpeechAnalysisResult =
  | { success: true; data: SpeechAnalysisForCognitiveDeclineOutput }
  | { success: false; error: string };


export async function analyzeSpeech(
  audioDataUri: string,
  transcript: string
): Promise<SpeechAnalysisResult> {
  if (!audioDataUri && !transcript) {
     return { success: false, error: 'Audio data or transcript is missing.' };
  }
  
  try {
    const result = await analyzeSpeechForCognitiveDecline({
      audioDataUri: audioDataUri || '',
      transcript: transcript || '',
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing speech:', error);
    return { success: false, error: 'An unexpected error occurred during speech analysis. Please try again later.' };
  }
}


export type CognitiveAnalysisResult =
  | { success: true; data: AnalyzeCognitiveTaskPerformanceOutput }
  | { success: false; error: string };

export async function analyzeCognitiveTask(
  performanceSummary: string
): Promise<CognitiveAnalysisResult> {
  try {
    const result = await analyzeCognitiveTaskPerformance({
      performanceSummary,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing cognitive task:', error);
    return { success: false, error: 'An unexpected error occurred during the analysis. Please try again later.' };
  }
}
