'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { BarChart3, Flame, LayoutGrid, Swords, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useGame } from '@/components/providers/game-provider';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/quests', label: 'Quests', icon: Swords },
  { href: '/dungeons', label: 'Dungeons', icon: Shield },
  { href: '/tracker', label: 'Tracker', icon: Flame },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { userProfile } = useGame();

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


  return (
    <Sidebar className="border-r border-border/20">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://i.imgur.com/mgVlBQj.png" alt="RISE Logo" width={32} height={32} className="w-8 h-8 text-primary glow-primary" />
          <h1 className="text-xl font-headline font-semibold">
            RISE
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href &&
                      'bg-primary/10 text-primary border border-primary/50 glow-primary hover:bg-primary/20 hover:text-primary'
                  )}
                  asChild
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
     {userProfile && (
        <SidebarFooter className="p-4">
            <Link href="/profile">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                    <Avatar className="h-10 w-10 border-2 border-accent">
                         <AvatarImage src={getAvatarForRank(userProfile.rank)} alt={userProfile.name} />
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{userProfile.name}</p>
                        <p className="text-xs text-muted-foreground">Level {userProfile.level}</p>
                    </div>
                </div>
            </Link>
        </SidebarFooter>
     )}
    </Sidebar>
  );
}
