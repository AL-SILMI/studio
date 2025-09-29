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
import {
  Edit,
  FileAudio,
  Mic,
  Upload,
  Loader2,
  RefreshCw,
  Square,
  CircleDot,
  Play,
  Pause,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { analyzeSpeech, type SpeechAnalysisResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing';

export function NewSpeechAnalysisCard({
  onAnalysisComplete,
}: {
  onAnalysisComplete: (result: SpeechAnalysisResult['data']) => void;
}) {
  const [activeTab, setActiveTab] = useState('audio');
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SpeechAnalysisResult['data'] | null>(null);
  const { toast } = useToast();

  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingState('recorded');
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        variant: 'destructive',
        title: 'Microphone access denied',
        description:
          'Please allow microphone access in your browser settings.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      // Stop all tracks to turn off the microphone indicator
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioPlayback = () => {
    if (audioRef.current) {
      if (recordingState === 'playing') {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };
  
  const handleAudioEnded = () => {
    setRecordingState('recorded');
  }

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
        audioElement.addEventListener('play', () => setRecordingState('playing'));
        audioElement.addEventListener('pause', () => setRecordingState('recorded'));
        audioElement.addEventListener('ended', handleAudioEnded);

        return () => {
            audioElement.removeEventListener('play', () => setRecordingState('playing'));
            audioElement.removeEventListener('pause', () => setRecordingState('recorded'));
            audioElement.removeEventListener('ended', handleAudioEnded);
        }
    }
  }, [audioRef.current]);

  const handleAnalyzeAudio = async () => {
    if (!audioBlob) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      const transcript = "The user provided an audio recording for analysis. The transcript should be generated from the audio.";

      const response = await analyzeSpeech(base64Audio, transcript);

      if (response.success) {
        setAnalysisResult(response.data);
        onAnalysisComplete(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: response.error,
        });
      }
      setIsAnalyzing(false);
    };
  };

  const handleAnalyzeTranscript = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const response = await analyzeSpeech('', transcript);

    if (response.success) {
      setAnalysisResult(response.data);
      onAnalysisComplete(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    }

    setIsAnalyzing(false);
  };
  
  const handleResetAudio = () => {
    setRecordingState('idle');
    setAudioBlob(null);
    setAudioUrl(null);
    setAnalysisResult(null);
  }

  const handleResetTranscript = () => {
    setTranscript('');
    setAnalysisResult(null);
  };
  
  const renderAudioContent = () => {
    if (analysisResult) {
      return (
        <Alert>
          <AlertTitle>Analysis Complete</AlertTitle>
          <AlertDescription className="prose prose-sm dark:prose-invert">
            {analysisResult.cognitiveDeclineIndicators}
          </AlertDescription>
        </Alert>
      );
    }

    if(isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing audio...</p>
            </div>
        );
    }

    switch (recordingState) {
      case 'idle':
        return (
          <>
            <FileAudio className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">
              Record your voice reading the sentence, or upload an audio file.
            </p>
            <div className="w-full text-center p-4 border-l-4 border-primary bg-accent/50 rounded-r-lg">
              <p className="italic text-foreground">
                The library is a quiet place to read and study.
              </p>
            </div>
          </>
        );
      case 'recording':
        return (
          <>
            <CircleDot className="h-16 w-16 text-destructive animate-pulse" />
            <p className="text-muted-foreground text-sm">Recording in progress...</p>
          </>
        );
      case 'recorded':
      case 'playing':
        return (
          <>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleAudioPlayback} size="icon" variant="ghost">
                {recordingState === 'playing' ? <Pause /> : <Play />}
              </Button>
              <div className="w-64">
                <audio ref={audioRef} src={audioUrl || ''} />
                <p className="text-sm text-muted-foreground">Your recording</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Happy with your recording? Submit it for analysis.
            </p>
          </>
        );

      default:
        return null;
    }
  };

  const renderAudioFooter = () => {
    if (analysisResult) {
      return (
        <Button onClick={handleResetAudio} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Analyze Another
        </Button>
      );
    }
    
    if(isAnalyzing) return null;

    switch (recordingState) {
      case 'idle':
        return (
          <div className="flex gap-4 w-full">
            <Button className="w-full" onClick={handleStartRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        );
      case 'recording':
        return (
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleStopRecording}
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        );
      case 'recorded':
      case 'playing':
        return (
          <div className="flex gap-4 w-full">
            <Button className="w-full" onClick={handleAnalyzeAudio}>
              Submit for Analysis
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResetAudio}
            >
              Record Again
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col min-h-[380px]">
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
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <Tabs
          defaultValue="audio"
          value={activeTab}
          className="flex-grow flex flex-col w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            if (value === 'transcript') {
                handleResetAudio();
            } else {
                handleResetTranscript();
            }
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
            {renderAudioContent()}
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
            ) : isAnalyzing ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing transcript...</p>
                </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm">
                  Enter a transcript of the user's speech to analyze it for
                  cognitive indicators.
                </p>
                <Textarea
                  placeholder="Enter transcript here..."
                  className="flex-grow min-h-[150px]"
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
          renderAudioFooter()
        ) : analysisResult ? (
          <Button onClick={handleResetTranscript} variant="outline">
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
