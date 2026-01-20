'use client';

import { VideoSummary } from '@/types/video';
import { motion } from 'framer-motion';
import { Play, MoreVertical, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
    video: VideoSummary;
    className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
    return (
        <Link href={`/video/${video.id}`} className={cn('group block', className)}>
            <motion.div
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-2xl bg-card/50 border border-white/5 shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50 group-hover:shadow-2xl"
            >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={video.thumbnail}
                        alt={video.title || 'Video thumbnail'}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <div className="rounded-full bg-primary/90 p-4 backdrop-blur-md shadow-lg shadow-black/50">
                            <Play className="h-6 w-6 fill-white text-white" />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    {video.durationSeconds && (
                        <div className="absolute bottom-3 right-3 rounded-md bg-black/70 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white ring-1 ring-white/10">
                            {Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, '0')}
                        </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {video.isLive && (
                            <div className="rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white animate-pulse shadow-lg shadow-red-900/20">
                                LIVE
                            </div>
                        )}
                        {!video.isLive && (video.isSubscriptionOnly || video.isPaid) && (
                            <div className="rounded-md bg-amber-500/90 backdrop-blur-md px-2 py-1 text-xs font-bold text-black shadow-lg flex items-center gap-1">
                                <Star className="w-3 h-3 fill-black" />
                                <span>PREMIUM</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                            <AvatarImage src={video.user?.avatar} alt={video.user?.name} />
                            <AvatarFallback>{video.user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors text-base">
                                {video.title || 'Untitled Video'}
                            </h3>
                            <div className="mt-1.5 flex flex-col gap-0.5 text-xs text-muted-foreground">
                                <span className="font-medium hover:text-foreground transition-colors truncate">
                                    {video.user?.name || 'Unknown User'}
                                </span>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <span>1.2k views</span>
                                    <span className="text-[10px]">•</span>
                                    <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground h-fit p-1 hover:bg-white/10 rounded-full transition-colors">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
