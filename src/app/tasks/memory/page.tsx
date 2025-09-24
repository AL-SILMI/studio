'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

const cardImages = [
  PlaceHolderImages.find((img) => img.id === 'memory-task'),
  PlaceHolderImages.find((img) => img.id === 'pattern-task'),
  {
    id: 'card-1',
    imageUrl: 'https://picsum.photos/seed/101/200/200',
    imageHint: 'abstract colorful',
  },
  {
    id: 'card-2',
    imageUrl: 'https://picsum.photos/seed/102/200/200',
    imageHint: 'nature landscape',
  },
  {
    id: 'card-3',
    imageUrl: 'https://picsum.photos/seed/103/200/200',
    imageHint: 'animal wildlife',
  },
  {
    id: 'card-4',
    imageUrl: 'https://picsum.photos/seed/104/200/200',
    imageHint: 'city architecture',
  },
].filter(Boolean) as { id: string; imageUrl: string; imageHint: string }[];

const gameCards = [...cardImages, ...cardImages].map((card, i) => ({
  ...card,
  uniqueId: `${card.id}-${i}`,
}));

type CardState = 'flipped' | 'matched' | 'default';

export default function MemoryGamePage() {
  const [cards, setCards] = useState(
    [...gameCards].sort(() => Math.random() - 0.5)
  );
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(cards[index].id)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex].id === cards[secondIndex].id) {
        setMatchedCards((prev) => [...prev, cards[firstIndex].id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedCards.length === cardImages.length) {
      setIsGameComplete(true);
    }
  }, [matchedCards]);
  
  const getCardState = (index: number): CardState => {
    if (flippedCards.includes(index)) {
      return 'flipped';
    }
    if (matchedCards.includes(cards[index].id)) {
      return 'matched';
    }
    return 'default';
  }

  const resetGame = () => {
    setCards([...gameCards].sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setIsGameComplete(false);
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Cognitive Task: Memory Game</h1>
        <p className="text-muted-foreground mt-2">
          Click the cards to find matching pairs.
        </p>
      </div>
      
      {isGameComplete ? (
         <Card className="text-center p-8">
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-3xl font-bold">Task Complete!</h2>
              <p className="text-muted-foreground">You completed the memory task in {moves} moves.</p>
              <p className="text-sm">This data will be used in your overall risk score calculation.</p>
              <Button onClick={resetGame} className="mt-4">Play Again</Button>
            </CardContent>
        </Card>
      ) : (
        <>
           <div className="flex justify-between items-center mb-4 px-2">
            <p className="text-lg font-semibold">Moves: {moves}</p>
            <Button onClick={resetGame} variant="outline">Reset Game</Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <Card
                key={card.uniqueId}
                onClick={() => handleCardClick(index)}
                className={cn(
                  'aspect-square cursor-pointer transition-transform duration-300',
                  getCardState(index) === 'flipped' && 'transform -scale-x-100',
                  getCardState(index) === 'matched' && 'opacity-50 cursor-not-allowed'
                )}
              >
                <CardContent className="p-0 h-full w-full flex items-center justify-center">
                  {getCardState(index) !== 'default' ? (
                     <Image
                      src={card.imageUrl}
                      alt={card.imageHint}
                      width={200}
                      height={200}
                      className="object-cover h-full w-full rounded-lg"
                      data-ai-hint={card.imageHint}
                    />
                  ) : (
                    <div className="bg-muted h-full w-full rounded-lg" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
