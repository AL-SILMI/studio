'use client';
import { useState, useEffect, useMemo } from 'react';
import { Brain, Clock, Repeat, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const icons = ['Car', 'Cat', 'Dog', 'Fish', 'Tree', 'Star', 'Sun', 'Moon'];

const iconComponents: { [key: string]: React.ElementType } = {
  Car: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L2 12v9c0 .6.4 1 1 1h2"/><path d="M7 16h10"/><circle cx="8.5" cy="18.5" r="1.5"/><circle cx="15.5" cy="18.5" r="1.5"/></svg>,
  Cat: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78.43 2.9 2.13 2.5 3.92C16.11 11.41 14.1 13 12 13s-4.11-1.59-4.5-3.82c-.4-1.79.72-3.49 2.5-3.92A11.09 11.09 0 0 1 12 5z"/><path d="M9 13.5c-.69.69-1.5 2.1-1.5 3.5h9c0-1.4-.81-2.81-1.5-3.5"/><path d="M12 5a7.43 7.43 0 0 0-4.5 2"/><path d="M12 5a7.43 7.43 0 0 1 4.5 2"/></svg>,
  Dog: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.23a2.5 2.5 0 0 1 5 0"/><path d="M12 11v-2"/><path d="M12 15a5 5 0 0 0 5-5 5 5 0 0 0-10 0 5 5 0 0 0 5 5z"/><path d="M20 8.82a8.5 8.5 0 0 1-13.6 5.37L4 18.5V13h5.5"/><path d="m8 14 3-3"/></svg>,
  Fish: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8c-2.3 0-6.12 1.28-7.5 2.5s-1.28 6.12 2.5 7.5c3.78 1.22 7.5-1.28 7.5-2.5S18.3 8 16 8Z"/><path d="M8 12c-2.3 0-6.12-1.28-7.5-2.5s-1.28-6.12 2.5-7.5c3.78-1.22 7.5 1.28 7.5 2.5S10.3 12 8 12Z"/><path d="M13 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/></svg>,
  Tree: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-8"/><path d="M12 14-4 6"/><path d="m12 14 8-8"/><path d="M4 14h16"/></svg>,
  Star: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
};


type CardType = { id: number; icon: string; isFlipped: boolean; isMatched: boolean };

const createShuffledDeck = () => {
  return [...icons, ...icons]
    .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }))
    .sort(() => Math.random() - 0.5);
};

export function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>(createShuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].icon === cards[second].icon) {
        setCards((prev) =>
          prev.map((card) =>
            card.icon === cards[first].icon ? { ...card, isMatched: true } : card
          )
        );
        setFlipped([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, index) =>
              index === first || index === second ? { ...card, isFlipped: false } : card
            )
          );
          setFlipped([]);
        }, 1000);
      }
      setAttempts((prev) => prev + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (isGameActive && cards.every((card) => card.isMatched)) {
      setIsGameActive(false);
      setIsGameWon(true);
    }
  }, [cards, isGameActive]);

  const handleCardClick = (index: number) => {
    if (!isGameActive) {
      setIsGameActive(true);
    }
    if (flipped.length < 2 && !cards[index].isFlipped) {
      setCards((prev) =>
        prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
      );
      setFlipped((prev) => [...prev, index]);
    }
  };

  const handleRestart = () => {
    setCards(createShuffledDeck());
    setFlipped([]);
    setAttempts(0);
    setTimer(0);
    setIsGameActive(false);
    setIsGameWon(false);
  };
  
  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = iconComponents[iconName];
    return Icon ? <Icon className="w-1/2 h-1/2 text-foreground" /> : null;
  };


  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4 bg-muted p-3 rounded-lg">
          <div className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Time: <span className="font-semibold">{timer}s</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <Repeat className="h-5 w-5 text-primary" />
            Attempts: <span className="font-semibold">{attempts}</span>
          </div>
          <Button onClick={handleRestart} variant="outline">
            Restart Game
          </Button>
        </div>

        {isGameWon ? (
          <div className="text-center p-10 bg-accent rounded-lg">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Congratulations!</h2>
            <p className="text-muted-foreground">You completed the game.</p>
            <p>
              Final Time: {timer}s | Total Attempts: {attempts}
            </p>
            <Button onClick={handleRestart} className="mt-4">
              Play Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={cn('aspect-square rounded-lg cursor-pointer transition-transform duration-300', {
                  'transform [transform:rotateY(180deg)]': card.isFlipped,
                })}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => !card.isFlipped && handleCardClick(index)}
              >
                <div className="absolute w-full h-full rounded-lg bg-primary/20 flex items-center justify-center [backface-visibility:hidden]">
                  <Brain className="w-1/2 h-1/2 text-primary" />
                </div>
                <div className="absolute w-full h-full rounded-lg bg-accent flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  {card.isMatched ? (
                     <div className="w-full h-full flex items-center justify-center bg-green-500/20"><IconComponent iconName={card.icon} /></div>
                  ) : (
                    <IconComponent iconName={card.icon} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
