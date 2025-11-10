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

export default function DashboardPage() {
  const { userProfile, quests, updateUserProfile } = useGame();
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  useEffect(() => {
    if (userProfile && (!userProfile.height || !userProfile.weight || !userProfile.gender)) {
        setIsSetupOpen(true);
    }
  }, [userProfile]);

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

  if (!userProfile) {
    return null; // or a loading spinner
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-3 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary glow-primary">
              <AvatarImage src={getAvatarForRank(userProfile.rank)} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-3xl">{userProfile.name}</CardTitle>
              <CardDescription className={cn("text-lg", getRankColor(userProfile.rank))}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dungeons.slice(0,3).map((dungeon) => {
            const dungeonImage = PlaceHolderImages.find(img => img.id === dungeon.id);
            return (
              <Card key={dungeon.id} className="overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <Link href="/dungeons">
                  <div className="relative h-48 w-full">
                     {workoutImage && <Image
                      src={workoutImage.imageUrl}
                      alt={dungeon.title}
                      fill
                      data-ai-hint={workoutImage.imageHint}
                      className="object-cover"
                    />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-headline text-xl text-white">{dungeon.title}</h3>
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
