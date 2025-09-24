import { MemoryGame } from '@/components/tasks/memory-game';

export default function MemoryGamePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cognitive Task: Memory Game</h1>
        <p className="text-muted-foreground">
          Test your short-term memory. Click on the cards to find matching pairs.
        </p>
      </div>
      <MemoryGame />
    </div>
  );
}
