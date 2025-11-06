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
import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { BarChart3, Flame, LayoutGrid, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userProfile } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/workout-session', label: 'Workout Session', icon: Flame },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const avatarImage = PlaceHolderImages.find(img => img.id === 'avatar');

  return (
    <Sidebar className="border-r border-border/20">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo className="w-8 h-8 text-primary glow-primary" />
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
                  <>
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link href="/profile">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <Avatar className="h-10 w-10 border-2 border-accent">
                    {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={userProfile.name} />}
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground">Level {userProfile.level}</p>
                </div>
            </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
