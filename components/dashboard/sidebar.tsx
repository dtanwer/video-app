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
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">
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
                                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                                route.active ? 'text-white bg-white/10' : 'text-zinc-400'
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn('h-5 w-5 mr-3', route.active ? 'text-white' : 'text-zinc-400')} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2 border-t border-slate-800">
                <div className="flex items-center gap-x-3 mb-4 px-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-slate-800 text-white">
                            {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-zinc-400 truncate w-[140px]">{user?.email}</p>
                    </div>
                </div>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
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
                    <Button variant="ghost" className="md:hidden fixed left-4 top-4 z-50" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-r-slate-800">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-[calc(100vh-50px)] w-72 flex-col fixed inset-y-0 top-16 z-50">
                <SidebarContent />
            </div>
        </>
    );
}
