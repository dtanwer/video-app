'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-red-600">You</span>Tube
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name || user.email} />
                                        <AvatarFallback>{(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                                Sign In
                            </Button>
                            <Button size="sm" onClick={() => router.push('/register')}>
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
