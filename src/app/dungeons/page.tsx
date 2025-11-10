
'use client';

import { useState } from 'react';
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
import { Flame, Shield, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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


function DungeonCard({
  dungeon,
  isActive,
  isMastered,
  onStart,
  activeDungeonId,
  progress,
  onProgress,
  onMaster,
}: {
  dungeon: Dungeon;
  isActive: boolean;
  isMastered: boolean;
  onStart: (id: string) => void;
  activeDungeonId: string | null;
  progress: number;
  onProgress: () => void;
  onMaster: (id: string) => void;
}) {
  const { variant, icon: Icon } = getDifficultyBadge(dungeon.difficulty);
  const dungeonImage = getDungeonImage(dungeon.difficulty);
  const isAnotherDungeonActive = activeDungeonId !== null && !isActive;
  const isCompleted = progress >= dungeon.duration;

  const handleButtonClick = () => {
    if (isMastered) return;
    if (isActive) {
      if (isCompleted) {
        onMaster(dungeon.id);
      } else {
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
      return 'Complete Day';
    }
    if (isAnotherDungeonActive) return 'Another Dungeon Active';
    return 'Start Challenge';
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/50">
      <div className="relative h-48 w-full">
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
        <CardTitle className="font-headline text-xl">{dungeon.title}</CardTitle>
        <div className="flex gap-2">
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
            <div className='mt-4'>
                <p className='text-sm text-muted-foreground mb-1'>Progress: Day {progress} of {dungeon.duration}</p>
                <Progress value={(progress / dungeon.duration) * 100} className="h-2" />
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleButtonClick}
          disabled={isMastered || isAnotherDungeonActive}
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
  const [activeDungeonId, setActiveDungeonId] = useState<string | null>(null);
  const [masteredDungeons, setMasteredDungeons] = useState<string[]>([]);
  const [dungeonProgress, setDungeonProgress] = useState(0);
  
  const masteryPrograms = dungeons.filter(d => d.type === 'Mastery');
  const transformationPrograms = dungeons.filter(d => d.type === 'Transformation');

  const handleStartDungeon = (id: string) => {
    setActiveDungeonId(id);
    setDungeonProgress(1); // Start at day 1
  }
  
  const handleProgress = () => {
    setDungeonProgress(p => p + 1);
  }
  
  const handleMasterDungeon = (id: string) => {
    setMasteredDungeons(prev => [...prev, id]);
    setActiveDungeonId(null);
    setDungeonProgress(0);
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Dungeons"
        description="Embark on long-term challenge programs to achieve mastery."
      />

    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-headline mb-4">Mastery Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {masteryPrograms.map((dungeon) => (
                    <DungeonCard 
                        key={dungeon.id} 
                        dungeon={dungeon} 
                        isActive={activeDungeonId === dungeon.id}
                        isMastered={masteredDungeons.includes(dungeon.id)}
                        onStart={handleStartDungeon}
                        activeDungeonId={activeDungeonId}
                        progress={activeDungeonId === dungeon.id ? dungeonProgress : 0}
                        onProgress={handleProgress}
                        onMaster={handleMasterDungeon}
                    />
                ))}
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-headline mb-4">Transformation Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transformationPrograms.map((dungeon) => (
                     <DungeonCard 
                        key={dungeon.id} 
                        dungeon={dungeon} 
                        isActive={activeDungeonId === dungeon.id}
                        isMastered={masteredDungeons.includes(dungeon.id)}
                        onStart={handleStartDungeon}
                        activeDungeonId={activeDungeonId}
                        progress={activeDungeonId === dungeon.id ? dungeonProgress : 0}
                        onProgress={handleProgress}
                        onMaster={handleMasterDungeon}
                    />
                ))}
            </div>
        </div>
    </div>


    </div>
  );
}
