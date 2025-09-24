'use client';

import { useState } from 'react';
import { BarChart, Brain, FileText, Loader2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

export function RiskScoreCard() {
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
          <Brain className="h-5 w-5 text-primary" />
          <span>Risk Score Analysis</span>
        </CardTitle>
        <CardDescription>
          Generate an AI-powered dementia risk assessment based on your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Analyzing your data... This may take a moment.
            </p>
          </div>
        )}
        {result && !isLoading && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full border-8 border-border ${getRiskColor(result.riskScore)}`}
              >
                <span className="text-4xl font-bold">{result.riskScore}</span>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <div>
                <h4 className="font-semibold flex items-center gap-2"><BarChart className="h-4 w-4 text-primary" />Key Risk Factors</h4>
                <p className="text-sm text-muted-foreground">
                  {result.riskFactors}
                </p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  {result.recommendations}
                </p>
              </div>
            </div>
          </div>
        )}
        {!result && !isLoading && (
          <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
             <p>Click the button below to generate your risk score.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateScore}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isLoading ? 'Generating...' : 'Generate Risk Score'}
        </Button>
      </CardFooter>
    </Card>
  );
}
