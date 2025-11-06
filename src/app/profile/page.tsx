'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { userProfile as initialProfile, badges } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileSetup } from '@/components/profile/user-profile-setup';
import type { UserProfile } from '@/lib/types';

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
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const avatarImage = PlaceHolderImages.find((img) => img.id === 'avatar');

  useEffect(() => {
    setIsClient(true);
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        localStorage.setItem('userProfile', JSON.stringify(initialProfile));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
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

  if (!isClient) {
    return null; // Or a loading spinner
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
        title="Hunter Profile"
        description="Your identity and achievements in the system."
      />
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar className="h-32 w-32 mb-4 border-4 border-primary glow-primary">
          {avatarImage && (
            <AvatarImage src={avatarImage.imageUrl} alt={userProfile.name} />
          )}
          <AvatarFallback className="text-4xl">
            {userProfile.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-4xl font-headline font-bold">{userProfile.name}</h2>
        <p
          className={cn(
            'text-2xl font-semibold',
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-xl font-semibold">{userProfile.height ? `${userProfile.height} cm` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-xl font-semibold">{userProfile.weight ? `${userProfile.weight} kg`: 'N/A'}</p>
              </div>
               <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-xl font-semibold capitalize">{userProfile.gender || 'N/A'}</p>
              </div>
            </div>
          <p className="text-muted-foreground mb-4">
            All your progress is stored securely on this device. You can export
            your data to create a backup.
          </p>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Encrypted Data
          </Button>
        </CardContent>
      </Card>

      <section>
        <h3 className="text-2xl font-headline mb-4">Unlocked Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map(({ id, name, description, Icon }) => (
            <Card
              key={id}
              className="flex flex-col items-center p-6 text-center hover:bg-muted/50 transition-colors"
            >
              <div className="p-4 bg-accent/10 rounded-full mb-3 border border-accent/50">
                <Icon className="h-10 w-10 text-accent glow-accent" />
              </div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
