'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Puzzle, Loader2, Award } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { analyzeCognitiveTask, type CognitiveAnalysisResult } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


const WORDS_TO_MEMORIZE = [
  'River', 'Mountain', 'Forest', 'Ocean', 'Valley', 
  'Sun', 'Moon', 'Star', 'Cloud', 'Rain'
].sort(() => Math.random() - 0.5);

type GameState = 'idle' | 'displaying' | 'recalling' | 'analyzing' | 'results';

export function NewCognitiveTaskCard() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(10);
  const [recalledWords, setRecalledWords] = useState('');
  const [score, setScore] = useState(0);
  const [correctlyRecalled, setCorrectlyRecalled] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [recallStartTime, setRecallStartTime] = useState<number | null>(null);
  const [recallTime, setRecallTime] = useState<number | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (gameState !== 'displaying') return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState('recalling');
      setRecallStartTime(Date.now());
    }
  }, [gameState, timeLeft]);

  const handleStartGame = () => {
    setGameState('displaying');
    setTimeLeft(10);
    setRecalledWords('');
    setScore(0);
    setCorrectlyRecalled([]);
    setAnalysis(null);
    setRecallStartTime(null);
    setRecallTime(null);
  };

  const handleSubmitRecall = async () => {
    let finalRecallTime = 0;
    if (recallStartTime) {
      finalRecallTime = (Date.now() - recallStartTime) / 1000;
      setRecallTime(finalRecallTime);
    }

    setGameState('analyzing');
    const userWords = recalledWords.split(/[\s,]+/).filter(w => w.length > 0).map(w => w.toLowerCase());
    const originalWords = WORDS_TO_MEMORIZE.map(w => w.toLowerCase());
    
    let correctCount = 0;
    const correctWords: string[] = [];
    
    const uniqueUserWords = [...new Set(userWords)];

    uniqueUserWords.forEach(userWord => {
      if (originalWords.includes(userWord)) {
        correctCount++;
        const originalCasing = WORDS_TO_MEMORIZE.find(w => w.toLowerCase() === userWord);
        if(originalCasing) correctWords.push(originalCasing);
      }
    });
    
    setScore(correctCount);
    setCorrectlyRecalled(correctWords);

    const performanceSummary = `User was asked to memorize ${WORDS_TO_MEMORIZE.length} words. They took ${finalRecallTime.toFixed(2)} seconds to recall them. They correctly recalled ${correctCount} words. The recalled words were: ${correctWords.join(', ')}.`;

    const response = await analyzeCognitiveTask(performanceSummary);

    if (response.success) {
      setAnalysis(response.data.analysis);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }

    setGameState('results');
  };

  const handleReset = () => {
    setGameState('idle');
  }

  const renderContent = () => {
    switch(gameState) {
      case 'idle':
        return (
          <>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
              <Puzzle className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">
                Test your memory and pattern recognition skills.
              </p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={handleStartGame}>Start Task</Button>
            </CardFooter>
          </>
        );

      case 'displaying':
        return (
          <>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-6">
              <h2 className="text-xl font-semibold">Memorize these words...</h2>
              <div className="flex flex-wrap justify-center gap-2 p-4 rounded-lg bg-muted">
                {WORDS_TO_MEMORIZE.map(word => (
                  <span key={word} className="text-lg font-medium px-2 py-1 bg-background rounded-md">{word}</span>
                ))}
              </div>
              <div className="w-full max-w-sm">
                <Progress value={timeLeft * 10} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{timeLeft} seconds remaining</p>
              </div>
            </CardContent>
          </>
        );

      case 'recalling':
        return (
          <>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
              <h2 className="text-xl font-semibold">What words do you remember?</h2>
              <p className="text-muted-foreground text-sm">Enter the words you recall, separated by spaces or commas.</p>
              <Textarea 
                className="w-full max-w-sm h-28 text-base"
                placeholder="Enter words here..."
                value={recalledWords}
                onChange={(e) => setRecalledWords(e.target.value)}
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={handleSubmitRecall} disabled={!recalledWords.trim()}>Submit</Button>
            </CardFooter>
          </>
        );
      
      case 'analyzing':
        return (
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your results...</p>
            </CardContent>
        );

      case 'results':
        return (
          <>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
              <Award className="h-12 w-12 text-yellow-500" />
              <h2 className="text-2xl font-bold">Task Complete!</h2>
              <p className="text-muted-foreground">You remembered {score} out of {WORDS_TO_MEMORIZE.length} words correctly in {recallTime?.toFixed(2)} seconds.</p>
              {analysis && (
                <Alert>
                  <AlertTitle>Performance Analysis</AlertTitle>
                  <AlertDescription>
                    {analysis}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={handleReset}>Try Again</Button>
            </CardFooter>
          </>
        );
    }
  }

  return (
    <Card className="flex flex-col min-h-[380px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span>Cognitive Task</span>
        </CardTitle>
        <CardDescription>
          Complete a short task to assess memory and cognitive function.
        </CardDescription>
      </CardHeader>
      {renderContent()}
    </Card>
  );
}
