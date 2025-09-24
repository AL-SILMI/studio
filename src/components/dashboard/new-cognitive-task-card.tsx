import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Puzzle } from 'lucide-react';

export function NewCognitiveTaskCard() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span>Cognitive Task</span>
        </CardTitle>
        <CardDescription>
          Complete a short task to assess memory and cognitive function.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
        <Puzzle className="h-16 w-16 text-muted-foreground/50" />
        <p className="text-muted-foreground text-sm">
          Test your memory and pattern recognition skills.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/tasks/memory">Start Task</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
