'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
                 <Image src="https://i.imgur.com/mgVlBQj.png" alt="RISE Logo" width={80} height={80} className="w-20 h-20 text-primary animate-pulse glow-primary" />
                 <p className="text-muted-foreground">Loading System...</p>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
