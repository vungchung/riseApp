
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { dungeons } from '@/lib/data';
import { XpBar } from '@/components/xp-bar';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { UserProfileSetup } from '@/components/profile/user-profile-setup';
import type { UserProfile } from '@/lib/types';
import { useGame } from '@/components/providers/game-provider';
import QuestsOverview from '@/components/quests-overview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


function getRankColor(rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') {
  switch (rank) {
    case 'E': return 'text-gray-400';
    case 'D': return 'text-green-400';
    case 'C': return 'text-blue-400';
    case 'B': return 'text-purple-400';
    case 'A': return 'text-orange-400';
    case 'S': return 'text-red-400 glow-primary';
    default: return 'text-gray-400';
  }
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Dashboard"
        description="Your journey to become an S-Rank Hunter starts now."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
             <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full" />
            <div className="text-center sm:text-left">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline">Active Quests</h2>
            <Button variant="ghost" asChild>
                <Link href="/quests">
                    View All
                </Link>
            </Button>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
         </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline">Dungeons</h2>
            <Button variant="ghost" asChild>
                <Link href="/dungeons">
                    View All
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </section>
    </div>
  );
}


export default function DashboardPage() {
  const { userProfile, quests, updateUserProfile, isLoading } = useGame();
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  useEffect(() => {
    // Only open the setup if the profile is loaded and data is missing.
    if (!isLoading && userProfile && (!userProfile.height || !userProfile.weight || !userProfile.gender)) {
        setIsSetupOpen(true);
    }
  }, [isLoading, userProfile]);

  const handleProfileSave = (data: Partial<UserProfile>) => {
    updateUserProfile(data);
  };
  
  const getAvatarForRank = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const rankAvatars: Record<typeof rank, string> = {
      'E': 'https://i.imgur.com/OSGLHe1.png',
      'D': 'https://i.imgur.com/8J0taDb.png',
      'C': 'https://i.imgur.com/JXrwrnb.png',
      'B': 'https://i.imgur.com/xyqvf59.png',
      'A': 'https://i.imgur.com/4ljhQdc.png',
      'S': 'https://i.imgur.com/179ObB9.png',
    };
    return rankAvatars[rank] || rankAvatars['E'];
  }

  const workoutImage = PlaceHolderImages.find(img => img.id === 'workout-theme');

  if (isLoading || !userProfile) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <UserProfileSetup
        userProfile={userProfile}
        onSave={handleProfileSave}
        open={isSetupOpen}
        onOpenChange={setIsSetupOpen}
      />
      <PageHeader
        title="Dashboard"
        description="Your journey to become an S-Rank Hunter starts now."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="md:col-span-3 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary glow-primary">
              <AvatarImage src={getAvatarForRank(userProfile.rank)} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="font-headline text-2xl sm:text-3xl">{userProfile.name}</CardTitle>
              <CardDescription className={cn("text-lg sm:text-xl", getRankColor(userProfile.rank))}>
                Level {userProfile.level} - {userProfile.rank}-Rank Hunter
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <XpBar
              value={(userProfile.xp / userProfile.xpToNextLevel) * 100}
              label={`${userProfile.xp} / ${userProfile.xpToNextLevel} XP`}
            />
          </CardContent>
        </Card>
      </div>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-headline">Active Quests</h2>
            <Button variant="ghost" asChild>
                <Link href="/quests">
                    View All
                </Link>
            </Button>
        </div>
        <QuestsOverview quests={quests} />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-headline">Dungeons</h2>
            <Button variant="ghost" asChild>
                <Link href="/dungeons">
                    View All
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dungeons.slice(0,3).map((dungeon) => {
            const dungeonImage = PlaceHolderImages.find(img => img.id.includes(dungeon.difficulty.toLowerCase()));
            return (
              <Card key={dungeon.id} className="overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <Link href="/dungeons">
                  <div className="relative h-40 sm:h-48 w-full">
                     {dungeonImage && <Image
                      src={dungeonImage.imageUrl}
                      alt={dungeon.title}
                      fill
                      data-ai-hint={dungeonImage.imageHint}
                      className="object-cover"
                    />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-headline text-lg sm:text-xl text-white">{dungeon.title}</h3>
                      <p className="text-sm text-accent">{dungeon.difficulty}</p>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
