'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

export function MobileHeader() {
    return (
        <header className="md:hidden flex items-center justify-between p-4 border-b fixed top-0 w-full bg-background z-40 h-16">
            <Link href="/" className="flex items-center gap-2">
                <Image src="https://i.imgur.com/mgVlBQj.png" alt="RISE Logo" width={32} height={32} />
                <h1 className="text-xl font-headline font-semibold">
                    RISE
                </h1>
            </Link>
            <SidebarTrigger />
        </header>
    )
}