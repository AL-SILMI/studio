import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-primary', className)}>
      <BrainCircuit className="h-7 w-7" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        CogniScreen
      </span>
    </div>
  );
}
