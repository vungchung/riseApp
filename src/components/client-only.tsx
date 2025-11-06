'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

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
        <div className="flex h-screen w-full">
            <div className="w-64 border-r p-4 hidden md:flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                 <div className="mt-auto">
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
            <div className="flex-1 p-8">
                 <Skeleton className="h-12 w-1/3 mb-8" />
                 <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
