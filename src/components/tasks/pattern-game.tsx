'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

type Sequence = {
  sequence: number[];
  answer: number;
  rule: string;
};

const sequences: Sequence[] = [
  { sequence: [2, 4, 6, 8], answer: 10, rule: 'Add 2 to the previous number.' },
  { sequence: [10, 8, 6, 4], answer: 2, rule: 'Subtract 2 from the previous number.' },
  { sequence: [3, 6, 12, 24], answer: 48, rule: 'Multiply the previous number by 2.' },
  { sequence: [1, 4, 9, 16], answer: 25, rule: 'Square of consecutive integers (1², 2², 3², 4²...).' },
  { sequence: [1, 1, 2, 3, 5], answer: 8, rule: 'Fibonacci sequence (each number is the sum of the two preceding ones).' },
];

export function PatternGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = useMemo(() => sequences[currentQuestionIndex], [currentQuestionIndex]);

  const handleAnswerSubmit = () => {
    if (userAnswer === '') return;
    setIsAnswered(true);
    const correct = parseInt(userAnswer, 10) === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sequences.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswer('');
    setIsAnswered(false);
    setIsFinished(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4 bg-muted p-3 rounded-lg">
          <h3 className="font-semibold">
            Question {currentQuestionIndex + 1} of {sequences.length}
          </h3>
          <h3 className="font-semibold">Score: {score}</h3>
        </div>

        {isFinished ? (
          <div className="text-center p-10 bg-accent rounded-lg">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Game Over!</h2>
            <p className="text-muted-foreground">You have completed all the questions.</p>
            <p>
              Final Score: {score} / {sequences.length}
            </p>
            <Button onClick={handleRestart} className="mt-4">
              Play Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-center">What is the next number in this sequence?</p>
            <div className="flex justify-center items-center gap-4 text-2xl md:text-4xl font-bold tracking-widest">
              {currentQuestion.sequence.map((num, index) => (
                <span key={index}>{num}</span>
              ))}
              <span>?</span>
            </div>
            
            <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
              <Input
                type="number"
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isAnswered}
                onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleAnswerSubmit()}
              />
              <Button onClick={handleAnswerSubmit} disabled={isAnswered}>
                Submit
              </Button>
            </div>
            
            {isAnswered && (
              <div className="mt-4 max-w-sm mx-auto">
                {isCorrect ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Correct!</AlertTitle>
                    <AlertDescription>
                      Well done! The next number is indeed {currentQuestion.answer}.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Incorrect</AlertTitle>
                    <AlertDescription>
                      The correct answer was {currentQuestion.answer}.
                    </AlertDescription>
                  </Alert>
                )}
                <Alert variant="default" className="mt-2 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Rule</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                      {currentQuestion.rule}
                    </AlertDescription>
                </Alert>
                <Button onClick={handleNextQuestion} className="w-full mt-4">
                  {currentQuestionIndex === sequences.length - 1 ? 'Finish Game' : 'Next Question'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
