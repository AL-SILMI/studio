'use server';
/**
 * @fileOverview Analyzes cognitive task performance and provides feedback.
 *
 * - analyzeCognitiveTaskPerformance - A function that analyzes task performance.
 * - AnalyzeCognitiveTaskPerformanceInput - The input type for the function.
 * - AnalyzeCognitiveTaskPerformanceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCognitiveTaskPerformanceInputSchema = z.object({
  performanceSummary: z.string().describe('A summary of the user\'s task performance, including score and any relevant details.'),
});
export type AnalyzeCognitiveTaskPerformanceInput = z.infer<
  typeof AnalyzeCognitiveTaskPerformanceInputSchema
>;

const AnalyzeCognitiveTaskPerformanceOutputSchema = z.object({
  analysis: z
    .string()
    .describe('A concise analysis of the performance, highlighting strengths and areas for improvement, and providing context on what the results might indicate about their short-term memory.'),
});
export type AnalyzeCognitiveTaskPerformanceOutput = z.infer<
  typeof AnalyzeCognitiveTaskPerformanceOutputSchema
>;

export async function analyzeCognitiveTaskPerformance(
  input: AnalyzeCognitiveTaskPerformanceInput
): Promise<AnalyzeCognitiveTaskPerformanceOutput> {
  return analyzeCognitiveTaskPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCognitiveTaskPerformancePrompt',
  input: {schema: AnalyzeCognitiveTaskPerformanceInputSchema},
  output: {schema: AnalyzeCognitiveTaskPerformanceOutputSchema},
  prompt: `You are an AI assistant evaluating a user's performance on a short-term memory recall task.

The user was shown a list of words and asked to recall them.

Performance Summary: {{{performanceSummary}}}

Based on this summary, provide a concise, encouraging, and easy-to-understand analysis of their performance. Explain what the score means in the context of a short-term memory test. Do not be alarming, but provide gentle feedback. Keep it to 2-3 sentences.
`,
});

const analyzeCognitiveTaskPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeCognitiveTaskPerformanceFlow',
    inputSchema: AnalyzeCognitiveTaskPerformanceInputSchema,
    outputSchema: AnalyzeCognitiveTaskPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
