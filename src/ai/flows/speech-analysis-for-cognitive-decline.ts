'use server';

/**
 * @fileOverview Analyzes speech patterns for indicators of cognitive decline.
 *
 * - analyzeSpeechForCognitiveDecline - A function that analyzes speech and returns cognitive decline indicators.
 * - SpeechAnalysisForCognitiveDeclineInput - The input type for the analyzeSpeechForCognitiveDecline function.
 * - SpeechAnalysisForCognitiveDeclineOutput - The return type for the analyzeSpeechForCognitiveDecline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const SpeechAnalysisForCognitiveDeclineInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of the user's speech as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  transcript: z.string().describe('The transcript of the user speech.'),
});
export type SpeechAnalysisForCognitiveDeclineInput = z.infer<
  typeof SpeechAnalysisForCognitiveDeclineInputSchema
>;

const SpeechAnalysisForCognitiveDeclineOutputSchema = z.object({
  cognitiveDeclineIndicators: z
    .string()
    .describe(
      'A detailed analysis of the speech patterns, including pauses, word choice, sentence structure, and other indicators of cognitive decline.'
    ),
});
export type SpeechAnalysisForCognitiveDeclineOutput = z.infer<
  typeof SpeechAnalysisForCognitiveDeclineOutputSchema
>;

export async function analyzeSpeechForCognitiveDecline(
  input: SpeechAnalysisForCognitiveDeclineInput
): Promise<SpeechAnalysisForCognitiveDeclineOutput> {
  return analyzeSpeechForCognitiveDeclineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'speechAnalysisForCognitiveDeclinePrompt',
  input: {schema: SpeechAnalysisForCognitiveDeclineInputSchema},
  output: {schema: SpeechAnalysisForCognitiveDeclineOutputSchema},
  prompt: `You are an expert in analyzing speech patterns for indicators of cognitive decline.
First, transcribe the provided audio. Then, analyze the transcript for indicators of cognitive decline, such as pauses, word choice, and sentence structure. If a transcript is already provided, use that as the primary source.

Audio: {{media url=audioDataUri}}
Transcript: {{{transcript}}}

Based on your analysis, provide a detailed summary of any speech patterns that could indicate cognitive decline. Return the result in JSON format.`,
});

const analyzeSpeechForCognitiveDeclineFlow = ai.defineFlow(
  {
    name: 'analyzeSpeechForCognitiveDeclineFlow',
    inputSchema: SpeechAnalysisForCognitiveDeclineInputSchema,
    outputSchema: SpeechAnalysisForCognitiveDeclineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
