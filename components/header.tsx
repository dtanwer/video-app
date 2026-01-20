'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, LayoutDashboard, Plus, Upload, Radio, PenSquare, Play, Search, CreditCard, ListMusic } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';

import { useState, useEffect } from 'react';

export function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Initialize search query from URL
    useEffect(() => {
        const query = searchParams.get('search') || '';
        setSearchQuery(query);
        setDebouncedQuery(query);
    }, [searchParams]);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Update URL when debounced query changes
    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (debouncedQuery !== currentSearch) {
            if (debouncedQuery.trim()) {
                router.push(`/?search=${encodeURIComponent(debouncedQuery)}`);
            } else if (currentSearch) {
                router.push('/');
            }
        }
    }, [debouncedQuery, router, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Immediate search on enter
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push('/');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background dark:glass dark:border-white/5">
            <div className="container flex h-16 items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-gradient-primary hidden sm:inline-block">VPlay</span>
                </Link>

                <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search videos..."
                        className="pl-9 h-9 bg-secondary/50 border-border focus:bg-background transition-colors rounded-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 hover:bg-accent"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span className="hidden md:inline">Create</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => router.push('/video/upload')}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        <span>Upload Video</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/live/start')}>
                                        <Radio className="mr-2 h-4 w-4" />
                                        <span>Go Live</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <PenSquare className="mr-2 h-4 w-4" />
                                        <span>Create Post</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-border hover:ring-primary/50 transition-all">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/playlists')}>
                                        <ListMusic className="mr-2 h-4 w-4" />
                                        <span>Playlists</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/subscription')}>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        <span>Premium</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="hover:bg-accent">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
