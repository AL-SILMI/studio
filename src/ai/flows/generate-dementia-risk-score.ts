'use server';
/**
 * @fileOverview Generates a dementia risk score based on cognitive task performance, speech patterns, and behavioral data.
 *
 * - generateDementiaRiskScore - A function that generates a dementia risk score.
 * - GenerateDementiaRiskScoreInput - The input type for the generateDementiaRiskScore function.
 * - GenerateDementiaRiskScoreOutput - The return type for the generateDementiaRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDementiaRiskScoreInputSchema = z.object({
  cognitiveTaskPerformance: z
    .string()
    .describe('Summary of the user\'s cognitive task performance.'),
  speechPatterns: z.string().describe('Summary of the user\'s speech patterns.'),
  behavioralData: z.string().describe('Summary of the user\'s behavioral data.'),
});
export type GenerateDementiaRiskScoreInput = z.infer<
  typeof GenerateDementiaRiskScoreInputSchema
>;

const GenerateDementiaRiskScoreOutputSchema = z.object({
  riskScore: z
    .number()
    .describe(
      'The dementia risk score, ranging from 0 (low risk) to 100 (high risk).'
    ),
  riskFactors: z
    .string()
    .describe('A summary of the key risk factors contributing to the score.'),
  recommendations: z
    .string()
    .describe('Recommendations for further evaluation or intervention.'),
});
export type GenerateDementiaRiskScoreOutput = z.infer<
  typeof GenerateDementiaRiskScoreOutputSchema
>;

export async function generateDementiaRiskScore(
  input: GenerateDementiaRiskScoreInput
): Promise<GenerateDementiaRiskScoreOutput> {
  return generateDementiaRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDementiaRiskScorePrompt',
  input: {schema: GenerateDementiaRiskScoreInputSchema},
  output: {schema: GenerateDementiaRiskScoreOutputSchema},
  prompt: `You are an AI assistant that analyzes user data to generate a dementia risk score.

  Based on the provided cognitive task performance, speech patterns, and behavioral data, generate a dementia risk score between 0 and 100 (inclusive), where a higher score indicates a higher risk of dementia.  Also, provide a summary of the key risk factors contributing to the score, and recommendations for further evaluation or intervention.

Cognitive Task Performance: {{{cognitiveTaskPerformance}}}
Speech Patterns: {{{speechPatterns}}}
Behavioral Data: {{{behavioralData}}}

Consider all data points to determine the final score, risk factors and recommendations. Return the result in JSON format.
`,
});

const generateDementiaRiskScoreFlow = ai.defineFlow(
  {
    name: 'generateDementiaRiskScoreFlow',
    inputSchema: GenerateDementiaRiskScoreInputSchema,
    outputSchema: GenerateDementiaRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
