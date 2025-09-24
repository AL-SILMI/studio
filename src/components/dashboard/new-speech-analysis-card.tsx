'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, FileAudio, Mic, Upload, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { analyzeSpeech, type SpeechAnalysisResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function NewSpeechAnalysisCard() {
  const [activeTab, setActiveTab] = useState('audio');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SpeechAnalysisResult['data'] | null>(null);
  const { toast } = useToast();

  const handleAnalyzeTranscript = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // This is a dummy audio URI since we only have a transcript.
    // The backend expects this, but it won't be used for transcript-only analysis.
    const dummyAudioDataUri =
      'data:audio/webm;base64,';

    const response = await analyzeSpeech(dummyAudioDataUri, transcript);

    if (response.success) {
      setAnalysisResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    }

    setIsAnalyzing(false);
  };
  
  const handleReset = () => {
    setTranscript('');
    setAnalysisResult(null);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          <span>Speech Analysis</span>
        </CardTitle>
        <CardDescription>
          Record audio, upload a file, or enter a transcript for AI analysis of
          cognitive indicators.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs
          defaultValue="audio"
          className="flex-grow flex flex-col"
          onValueChange={(value) => {
            setActiveTab(value);
            handleReset();
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio">
              <Mic className="mr-2 h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <Edit className="mr-2 h-4 w-4" />
              Transcript
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="audio"
            className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-4"
          >
            <FileAudio className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">
              Record your voice reading the sentence, or upload an audio file.
            </p>
            <div className="w-full text-center p-4 border-l-4 border-primary bg-accent/50 rounded-r-lg">
              <p className="italic text-foreground">
                The library is a quiet place to read and study.
              </p>
            </div>
          </TabsContent>
          <TabsContent
            value="transcript"
            className="flex-grow flex flex-col p-6 space-y-4"
          >
            {analysisResult ? (
              <Alert>
                <AlertTitle>Analysis Complete</AlertTitle>
                <AlertDescription className="prose prose-sm dark:prose-invert">
                  {analysisResult.cognitiveDeclineIndicators}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-muted-foreground text-sm">
                  Enter a transcript of the user's speech to analyze it for
                  cognitive indicators.
                </p>
                <Textarea
                  placeholder="Enter transcript here..."
                  className="flex-grow"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  disabled={isAnalyzing}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-end">
        {activeTab === 'audio' ? (
          <div className="flex gap-4 w-full">
            <Button className="w-full">
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        ) : analysisResult ? (
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Analyze Another
          </Button>
        ) : (
          <Button
            onClick={handleAnalyzeTranscript}
            disabled={isAnalyzing || !transcript.trim()}
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Edit className="mr-2 h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Transcript'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}