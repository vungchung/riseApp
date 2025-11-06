'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dailyQuest, dungeons, userProfile as initialProfile } from '@/lib/data';
import { Check, Swords } from 'lucide-react';
import { XpBar } from '@/components/xp-bar';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { UserProfileSetup } from '@/components/profile/user-profile-setup';
import type { UserProfile } from '@/lib/types';


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
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setUserProfile(profileData);
        if (!profileData.height || !profileData.weight || !profileData.gender) {
          setIsSetupOpen(true);
        }
      } else {
        localStorage.setItem('userProfile', JSON.stringify(initialProfile));
        setIsSetupOpen(true);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback for environments where localStorage is not available
       if (!userProfile.height || !userProfile.weight || !userProfile.gender) {
        setIsSetupOpen(true);
      }
    }
  }, []);

  const handleProfileSave = (data: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...data };
    setUserProfile(newProfile);
    try {
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
    } catch (error) {
       console.error("Failed to save to localStorage:", error);
    }
  };

  const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar');

  if (!isClient) {
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
              {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={userProfile.name} />}
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
        <h2 className="text-2xl font-headline mb-4">Daily Quest</h2>
        <Card className="border-primary glow-primary">
          <CardHeader>
            <CardTitle className="font-headline">{dailyQuest.title}</CardTitle>
            <CardDescription>{dailyQuest.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dailyQuest.tasks.map((task, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check
                    className={`h-5 w-5 ${
                      task.completed ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  />
                  <span>{task.description}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-4 w-full sm:w-auto" variant="secondary" asChild>
                <Link href="/workout-session">
                    <Swords className="mr-2 h-4 w-4"/>
                    Start Mandatory Quest
                </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-headline mb-4">Dungeons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dungeons.map((dungeon) => {
            const dungeonImage = PlaceHolderImages.find(img => img.id === dungeon.id);
            return (
              <Card key={dungeon.id} className="overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <Link href="#">
                  <div className="relative h-48 w-full">
                     {dungeonImage && <Image
                      src={dungeonImage.imageUrl}
                      alt={dungeon.title}
                      fill
                      data-ai-hint={dungeonImage.imageHint}
                      className="object-cover"
                    />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-headline text-xl text-white">{dungeon.title}</h3>
                      <p className="text-sm text-accent">{dungeon.difficulty}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm mb-2">{dungeon.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-primary">{dungeon.duration} Days</span>
                      <Button size="sm">Enter Dungeon</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
