'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Video,
    Settings,
    User,
    Shield,
    LogOut,
    Menu,
    Wallet as WalletIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const routes = [
        {
            href: '/dashboard',
            label: 'Overview',
            icon: LayoutDashboard,
            active: pathname === '/dashboard',
        },
        {
            href: '/dashboard/content',
            label: 'Content',
            icon: Video,
            active: pathname === '/dashboard/content',
        },
        {
            href: '/dashboard/profile',
            label: 'Profile',
            icon: User,
            active: pathname === '/dashboard/profile',
        },
        {
            href: '/dashboard/wallet',
            label: 'Wallet',
            icon: WalletIcon,
            active: pathname === '/dashboard/wallet',
        },
        {
            href: '/dashboard/settings',
            label: 'Settings',
            icon: Settings,
            active: pathname === '/dashboard/settings',
        },
    ];

    if (user?.role === 'admin') {
        routes.push({
            href: '/dashboard/admin',
            label: 'Admin Panel',
            icon: Shield,
            active: pathname === '/dashboard/admin',
        });
    }

    const SidebarContent = () => (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground border-r">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        Studio
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition',
                                route.active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn('h-5 w-5 mr-3', route.active ? 'text-primary' : 'text-muted-foreground')} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2 border-t">
                <div className="flex items-center gap-x-3 mb-4 px-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                            {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate w-[140px]">{user?.email}</p>
                    </div>
                </div>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "md:hidden fixed left-4 top-[70px] z-[100]",
                            isOpen && "hidden"
                        )}
                        size="icon"
                    >
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-[calc(100vh-50px)] w-72 flex-col fixed inset-y-0 top-16 z-50 bg-background border-r">
                <SidebarContent />
            </div>
        </>
    );
}
