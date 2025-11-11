'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { badges as allBadges } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileSetup } from '@/components/profile/user-profile-setup';
import type { UserProfile } from '@/lib/types';
import { useGame } from '@/components/providers/game-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function getRankColor(rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') {
  switch (rank) {
    case 'E':
      return 'text-gray-400';
    case 'D':
      return 'text-green-400';
    case 'C':
      return 'text-blue-400';
    case 'B':
      return 'text-purple-400';
    case 'A':
      return 'text-orange-400';
    case 'S':
      return 'text-red-400 glow-primary';
    default:
      return 'text-gray-400';
  }
}

export default function ProfilePage() {
  const { userProfile, updateUserProfile, unlockedBadges, resetGameData } = useGame();
  const [isSetupOpen, setIsSetupOpen] = useState(false);

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
  
  if (!userProfile) {
    return null; // Or a loading spinner
  }

  const displayedBadges = allBadges.filter(b => unlockedBadges.includes(b.id));
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <UserProfileSetup
        userProfile={userProfile}
        onSave={handleProfileSave}
        open={isSetupOpen}
        onOpenChange={setIsSetupOpen}
      />
      <PageHeader
        title="Hunter Profile"
        description="Your identity and achievements in the system."
      />
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 mb-4 border-4 border-primary glow-primary">
          <AvatarImage src={getAvatarForRank(userProfile.rank)} alt={userProfile.name} />
          <AvatarFallback className="text-3xl sm:text-4xl">
            {userProfile.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl sm:text-4xl font-headline font-bold">{userProfile.name}</h2>
        <p
          className={cn(
            'text-lg sm:text-2xl font-semibold',
            getRankColor(userProfile.rank)
          )}
        >
          Level {userProfile.level} - {userProfile.rank}-Rank Hunter
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle className="font-headline">System Data</CardTitle>
            <CardDescription>
              View and manage your personal data.
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsSetupOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg sm:text-xl font-semibold">{userProfile.height ? `${userProfile.height} cm` : 'N/A'}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg sm:text-xl font-semibold">{userProfile.weight ? `${userProfile.weight} kg`: 'N/A'}</p>
              </div>
               <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-lg sm:text-xl font-semibold capitalize">{userProfile.gender || 'N/A'}</p>
              </div>
            </div>
          <p className="text-sm text-muted-foreground my-4">
            All your progress is stored securely on this device. You can export
            your data to create a backup.
          </p>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Encrypted Data
          </Button>
        </CardContent>
      </Card>

      <section className="mb-8">
        <h3 className="text-2xl font-headline mb-4">Unlocked Badges</h3>
        {displayedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedBadges.map(({ id, name, description, Icon }) => (
              <Card
                key={id}
                className="flex flex-col items-center p-4 sm:p-6 text-center hover:bg-muted/50 transition-colors"
              >
                <div className="p-3 sm:p-4 bg-accent/10 rounded-full mb-3 border border-accent/50">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent glow-accent" />
                </div>
                <p className="font-semibold text-sm sm:text-base">{name}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className='text-center py-12'>
            <CardContent>
              <h3 className="text-xl font-headline font-bold">No Badges Yet</h3>
              <p className="text-muted-foreground mt-2">Complete quests and dungeons to earn badges.</p>
            </CardContent>
          </Card>
        )}
      </section>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="font-headline text-destructive flex items-center gap-2">
            <AlertTriangle />
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions are permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2" />
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your progress, including your level, quests, dungeons, and badges.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetGameData}>
                  Confirm Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
