'use server';

import {
  generateDementiaRiskScore,
  type GenerateDementiaRiskScoreOutput,
} from '@/ai/flows/generate-dementia-risk-score';
import {
  analyzeSpeechForCognitiveDecline,
  type SpeechAnalysisForCognitiveDeclineOutput,
} from '@/ai/flows/speech-analysis-for-cognitive-decline';

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
  if (!audioDataUri) {
     return { success: false, error: 'Audio data is missing.' };
  }
  if (!transcript) {
    return { success: false, error: 'Transcript is missing.' };
  }
  
  try {
    const result = await analyzeSpeechForCognitiveDecline({
      audioDataUri,
      transcript,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing speech:', error);
    return { success: false, error: 'An unexpected error occurred during speech analysis. Please try again later.' };
  }
}
