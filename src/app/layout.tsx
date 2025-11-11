
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { GameProvider } from '@/components/providers/game-provider';
import { MobileHeader } from '@/components/mobile-header';

export const metadata: Metadata = {
  title: "RISE: Hunter's Ascent",
  description: 'Solo-Leveling–inspired, fully offline RPG fitness trainer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <GameProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <MobileHeader />
                    <main className="flex-1 pt-16 md:pt-0">
                        {children}
                    </main>
                </div>
            </div>
          </SidebarProvider>
        </GameProvider>
        <Toaster />
      </body>
    </html>
  );
}
