'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getRiskScore, type RiskScoreResult } from '@/app/actions';

export function NewRiskScoreCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RiskScoreResult['data'] | null>(null);
  const { toast } = useToast();

  const handleGenerateScore = async () => {
    setIsLoading(true);
    setResult(null);

    const cognitiveTaskPerformance =
      'User completed memory task in 45 seconds with 2 errors. Pattern recognition was slow but accurate.';
    const speechPatterns =
      'Speech analysis shows frequent pauses and some word-finding difficulty.';
    const behavioralData =
      'User interacts with the app twice a week. Task completion times have increased by 15% over the last month.';

    const response = await getRiskScore(
      cognitiveTaskPerformance,
      speechPatterns,
      behavioralData
    );

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }

    setIsLoading(false);
  };
  
    const getRiskColor = (score: number) => {
        if (score > 75) return 'bg-destructive text-destructive-foreground';
        if (score > 50) return 'bg-yellow-500 text-black';
        return 'bg-green-500 text-white';
    };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Overall Risk Score</span>
        </CardTitle>
        <CardDescription>
          An AI-generated score indicating the likelihood of cognitive decline based on your assessments.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-2">
        {isLoading ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        ) : result ? (
            <div
                className={`flex h-28 w-28 items-center justify-center rounded-full border-8 border-border ${getRiskColor(result.riskScore)}`}
              >
                <span className="text-4xl font-bold">{result.riskScore}</span>
              </div>
        ) : (
            <>
                <p className="text-muted-foreground">Your risk score will appear here.</p>
                <p className="text-sm text-muted-foreground px-4">Complete all assessments to enable calculation.</p>
            </>
        )}
        
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateScore}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isLoading ? 'Calculating...' : 'Calculate Risk Score'}
        </Button>
      </CardFooter>
    </Card>
  );
}
