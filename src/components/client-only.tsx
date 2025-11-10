'use client';

import { useState, useEffect } from 'react';
import { AppLogo } from './icons';

type ClientOnlyProps = {
  children: React.ReactNode;
};

export function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                 <AppLogo className="w-20 h-20 text-primary animate-pulse glow-primary" />
                 <p className="text-muted-foreground">Loading System...</p>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
