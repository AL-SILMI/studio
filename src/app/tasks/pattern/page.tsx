import { PatternGame } from '@/components/tasks/pattern-game';

export default function PatternGamePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cognitive Task: Pattern Recognition</h1>
        <p className="text-muted-foreground">
          Identify the next number in the sequence. Good luck!
        </p>
      </div>
      <PatternGame />
    </div>
  );
}
