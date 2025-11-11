
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { dungeons } from '@/lib/data';
import type { Dungeon } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Shield, Star, CheckCircle, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useGame } from '@/components/providers/game-provider';

function getDifficultyBadge(
  difficulty: Dungeon['difficulty']
): { variant: 'default' | 'destructive' | 'secondary'; icon: React.ElementType } {
  switch (difficulty) {
    case 'Beginner':
      return { variant: 'secondary', icon: Star };
    case 'Intermediate':
      return { variant: 'default', icon: Shield };
    case 'Advanced':
      return { variant: 'destructive', icon: Flame };
    default:
      return { variant: 'secondary', icon: Star };
  }
}

function getDungeonImage(difficulty: Dungeon['difficulty']) {
    switch (difficulty) {
        case 'Beginner':
            return PlaceHolderImages.find(img => img.id === 'dungeon-beginner');
        case 'Intermediate':
            return PlaceHolderImages.find(img => img.id === 'dungeon-intermediate');
        case 'Advanced':
            return PlaceHolderImages.find(img => img.id === 'dungeon-advanced');
        default:
            return PlaceHolderImages.find(img => img.id === 'dungeon-beginner');
    }
}

// Simple deterministic random number generator for workout consistency
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const getDailyWorkout = (dungeonTitle: string, day: number) => {
    const seed = dungeonTitle.length + day;
    const repCount = 5 + Math.floor(seededRandom(seed) * 11); // 5 to 15 reps
    const setCount = 3 + Math.floor(seededRandom(seed * 2) * 3); // 3 to 5 sets
    
    let exercise = 'Push-ups';
    if (dungeonTitle.toLowerCase().includes('leg')) {
        exercise = 'Squats';
    } else if (dungeonTitle.toLowerCase().includes('body')) {
        const exercises = ['Push-ups', 'Squats', 'Lunges', 'Plank (30s)'];
        exercise = exercises[Math.floor(seededRandom(seed * 3) * exercises.length)];
    }

    return `${setCount} sets of ${repCount} ${exercise}`;
};


function DungeonCard({
  dungeon,
  onStart,
  onProgress,
  onMaster,
}: {
  dungeon: Dungeon;
  onStart: (id: string) => void;
  onProgress: () => void;
  onMaster: (id: string, badgeId: string) => void;
}) {
  const { 
    activeDungeonId,
    masteredDungeons, 
    dungeonProgress, 
    lastDungeonProgressDate 
  } = useGame();

  const isActive = activeDungeonId === dungeon.id;
  const isMastered = masteredDungeons.includes(dungeon.id);
  const { variant, icon: Icon } = getDifficultyBadge(dungeon.difficulty);
  const dungeonImage = getDungeonImage(dungeon.difficulty);
  const isAnotherDungeonActive = activeDungeonId !== null && !isActive;

  const today = new Date().toISOString().split('T')[0];
  const isProgressMadeToday = lastDungeonProgressDate === today;

  const progress = isActive ? dungeonProgress : 0;
  const isCompleted = progress >= dungeon.duration;
  const dailyWorkout = isActive ? getDailyWorkout(dungeon.title, progress) : null;

  const handleButtonClick = () => {
    if (isMastered) return;
    if (isActive) {
      if (isCompleted) {
        onMaster(dungeon.id, dungeon.badgeId);
      } else if (!isProgressMadeToday) {
        onProgress();
      }
    } else if (!activeDungeonId) {
      onStart(dungeon.id);
    }
  };

  const getButtonText = () => {
    if (isMastered) return 'Mastered';
    if (isActive) {
      if (isCompleted) return 'Master Dungeon';
      if (isProgressMadeToday) return 'Day Complete';
      return 'Complete Day';
    }
    if (isAnotherDungeonActive) return 'Dungeon in Progress';
    return 'Start Challenge';
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/50">
      <div className="relative h-40 sm:h-48 w-full">
        {dungeonImage && (
          <Image
            src={dungeonImage.imageUrl}
            alt={dungeon.title}
            fill
            data-ai-hint={dungeonImage.imageHint}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-lg sm:text-xl">{dungeon.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant={variant} className="gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            {dungeon.difficulty}
          </Badge>
          <Badge variant="outline">{dungeon.duration} Days</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{dungeon.description}</CardDescription>
        {isActive && (
            <div className='mt-4 space-y-4'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>Today's Task:</p>
                  <div className='flex items-center gap-2 p-3 rounded-md bg-muted/50'>
                    <Dumbbell className='w-4 h-4 text-accent flex-shrink-0'/>
                    <p className='font-mono text-sm font-semibold'>{dailyWorkout}</p>
                  </div>
                </div>
                <div>
                    <p className='text-sm text-muted-foreground mb-1'>Progress: Day {progress} of {dungeon.duration}</p>
                    <Progress value={(progress / dungeon.duration) * 100} className="h-2" />
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleButtonClick}
          disabled={isMastered || isAnotherDungeonActive || (isActive && isProgressMadeToday && !isCompleted)}
          variant={isCompleted ? 'default' : isActive ? 'outline' : 'default'}
        >
          {isMastered && <CheckCircle className="mr-2" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function DungeonsPage() {
  const { 
    startDungeon, 
    progressDungeon, 
    masterDungeon
  } = useGame();
  
  const masteryPrograms = dungeons.filter(d => d.type === 'Mastery');
  const transformationPrograms = dungeons.filter(d => d.type === 'Transformation');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Dungeons"
        description="Embark on long-term challenge programs to achieve mastery."
      />

    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-headline mb-4">Mastery Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {masteryPrograms.map((dungeon) => (
                    <DungeonCard 
                        key={dungeon.id} 
                        dungeon={dungeon} 
                        onStart={startDungeon}
                        onProgress={progressDungeon}
                        onMaster={masterDungeon}
                    />
                ))}
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-headline mb-4">Transformation Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {transformationPrograms.map((dungeon) => (
                     <DungeonCard 
                        key={dungeon.id} 
                        dungeon={dungeon} 
                        onStart={startDungeon}
                        onProgress={progressDungeon}
                        onMaster={masterDungeon}
                    />
                ))}
            </div>
        </div>
    </div>


    </div>
  );
}
