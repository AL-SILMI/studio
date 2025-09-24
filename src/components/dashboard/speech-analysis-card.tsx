import Link from 'next/link';
import { ArrowRight, Mic } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SpeechAnalysisCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <span>Speech Analysis</span>
        </CardTitle>
        <CardDescription>
          Analyze your speech for patterns that may indicate cognitive change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Record a short audio clip of yourself speaking. Our AI will analyze
          your vocal characteristics.
        </p>
        <Button asChild className="w-full">
          <Link href="/speech">
            Start Speech Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
