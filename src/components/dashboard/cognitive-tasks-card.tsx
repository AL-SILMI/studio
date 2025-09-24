import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const tasks = [
  {
    title: 'Memory Game',
    description: 'Test your short-term memory by matching pairs of cards.',
    href: '/tasks/memory',
    imageId: 'memory-task',
  },
  {
    title: 'Pattern Recognition',
    description: 'Identify the next item in a logical sequence.',
    href: '/tasks/pattern',
    imageId: 'pattern-task',
  },
];

export function CognitiveTasksCard() {
  const memoryTaskImage = PlaceHolderImages.find(img => img.id === 'memory-task');
  const patternTaskImage = PlaceHolderImages.find(img => img.id === 'pattern-task');
  const images = {
    'memory-task': memoryTaskImage,
    'pattern-task': patternTaskImage,
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Cognitive Tasks</CardTitle>
        <CardDescription>
          Challenge your mind with these exercises designed to assess cognitive
          function.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => {
            const image = images[task.imageId as keyof typeof images];
            return (
          <div key={task.title} className="relative group overflow-hidden rounded-lg border">
              {image && (
                 <Image
                    src={image.imageUrl}
                    alt={task.title}
                    width={400}
                    height={200}
                    className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                />
              )}
            <div className="p-4 bg-background/80 backdrop-blur-sm">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{task.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={task.href}>
                  Start Task <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )})}
      </CardContent>
    </Card>
  );
}
