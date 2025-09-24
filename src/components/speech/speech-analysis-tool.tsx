'use client';

import { useState, useRef, useEffect } from 'react';
import { analyzeSpeech, type SpeechAnalysisResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mic, Pause, Play, AlertTriangle, FileText } from 'lucide-react';

const textToRead =
  'The quick brown fox jumps over the lazy dog. I went to the park and saw many beautiful flowers. The sun was shining brightly in the clear blue sky.';

export function SpeechAnalysisTool() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SpeechAnalysisResult['data'] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setError(null);
    setAudioBlob(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setError('Microphone access was denied. Please enable it in your browser settings.');
        console.error('Error accessing microphone:', err);
      }
    } else {
      setError('Audio recording is not supported by your browser.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) {
      toast({ variant: 'destructive', title: 'Error', description: 'No audio recorded.' });
      return;
    }
    if (!transcript.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please provide a transcript.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      const response = await analyzeSpeech(base64Audio, transcript);
      if (response.success) {
        setAnalysis(response.data);
      } else {
        setError(response.error);
      }
      setIsLoading(false);
    };
  };
  
  const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Read the Passage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground p-4 border rounded-md bg-accent/50">
              {textToRead}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Record Your Speech</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  disabled={isLoading}
                  size="lg"
                  className="rounded-full w-20 h-20"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  disabled={isLoading}
                  size="lg"
                  variant="destructive"
                  className="rounded-full w-20 h-20"
                >
                  <Pause className="h-8 w-8" />
                </Button>
              )}
            </div>

            {audioURL && (
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary"/>
                <audio src={audioURL} controls className="w-full" />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Transcribe Your Speech</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type what you said here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={6}
              disabled={isLoading}
            />
          </CardContent>
        </Card>
        
        <Button onClick={handleAnalyze} disabled={isLoading || !audioBlob || !transcript} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Analyzing...' : 'Analyze My Speech'}
        </Button>

        {analysis && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{analysis.cognitiveDeclineIndicators}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
