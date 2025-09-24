'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Award } from 'lucide-react';

const WORDS_TO_MEMORIZE = [
  'River', 'Mountain', 'Forest', 'Ocean', 'Valley', 
  'Sun', 'Moon', 'Star', 'Cloud', 'Rain'
].sort(() => Math.random() - 0.5);

type GameState = 'idle' | 'displaying' | 'recalling' | 'results';

export default function MemoryGamePage() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState(10);
  const [recalledWords, setRecalledWords] = useState('');
  const [score, setScore] = useState(0);
  const [correctlyRecalled, setCorrectlyRecalled] = useState<string[]>([]);
  
  useEffect(() => {
    if (gameState !== 'displaying') return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState('recalling');
    }
  }, [gameState, timeLeft]);
  
  const handleStartGame = () => {
    setGameState('displaying');
    setTimeLeft(10);
    setRecalledWords('');
    setScore(0);
    setCorrectlyRecalled([]);
  };

  const handleSubmitRecall = () => {
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
    setGameState('results');
  };

  const renderGameState = () => {
    switch(gameState) {
      case 'idle':
        return (
          <CardContent className="flex flex-col items-center justify-center text-center gap-4">
            <h1 className="text-3xl font-bold">Word Recall Task</h1>
            <p className="text-muted-foreground max-w-md">
              This task evaluates short-term memory recall. A list of words will be displayed for 10 seconds. After they disappear, you will be prompted to enter as many of the words as you can remember.
            </p>
            <Button onClick={handleStartGame} size="lg">Start Task</Button>
          </CardContent>
        );
      
      case 'displaying':
        return (
          <CardContent className="flex flex-col items-center justify-center text-center gap-6">
            <h2 className="text-2xl font-semibold">Memorize these words...</h2>
            <div className="flex flex-wrap justify-center gap-4 p-4 rounded-lg bg-muted">
              {WORDS_TO_MEMORIZE.map(word => (
                <span key={word} className="text-xl font-medium px-3 py-1 bg-background rounded-md">{word}</span>
              ))}
            </div>
            <div className="w-full max-w-md">
               <Progress value={timeLeft * 10} className="h-2" />
               <p className="text-sm text-muted-foreground mt-2">{timeLeft} seconds remaining</p>
            </div>
          </CardContent>
        );

      case 'recalling':
        return (
          <CardContent className="flex flex-col items-center justify-center text-center gap-4">
            <h2 className="text-2xl font-semibold">What words do you remember?</h2>
            <p className="text-muted-foreground">Enter the words you recall, separated by spaces or commas.</p>
            <Textarea 
              className="w-full max-w-md h-32 text-base"
              placeholder="Enter words here..."
              value={recalledWords}
              onChange={(e) => setRecalledWords(e.target.value)}
            />
            <Button onClick={handleSubmitRecall} disabled={!recalledWords.trim()}>Submit</Button>
          </CardContent>
        );

      case 'results':
        return (
          <CardContent className="flex flex-col items-center justify-center text-center gap-4">
             <Award className="h-16 w-16 text-yellow-500" />
            <h2 className="text-3xl font-bold">Task Complete!</h2>
            <p className="text-muted-foreground">You remembered {score} out of {WORDS_TO_MEMORIZE.length} words correctly.</p>
            <div className="text-left bg-muted p-4 rounded-lg w-full max-w-md">
              <h3 className="font-semibold mb-2">Your correct words:</h3>
              {correctlyRecalled.length > 0 ? (
                 <p className="text-green-600">{correctlyRecalled.join(', ')}</p>
              ) : (
                <p className="text-muted-foreground italic">You didn't recall any words correctly.</p>
              )}
            </div>
             <p className="text-sm">This data will be used in your overall risk score calculation.</p>
            <Button onClick={handleStartGame} className="mt-4">Try Again</Button>
          </CardContent>
        )
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="min-h-[400px] flex items-center justify-center">
        {renderGameState()}
      </Card>
    </div>
  );
}
