'use client';

import { VideoSummary } from '@/types/video';
import { motion } from 'framer-motion';
import { Play, MoreVertical } from 'lucide-react';
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
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md"
            >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={video.thumbnail}
                        alt={video.title || 'Video thumbnail'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay with Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                            <Play className="h-6 w-6 fill-white text-white" />
                        </div>
                    </div>
                    {video.durationSeconds && (
                        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                            {Math.floor(video.durationSeconds / 60)}:{String(video.durationSeconds % 60).padStart(2, '0')}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={video.user?.avatar} alt={video.user?.name} />
                            <AvatarFallback>{video.user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold leading-none tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {video.title || 'Untitled Video'}
                            </h3>
                            <div className="text-xs text-muted-foreground">
                                <p className="font-medium hover:text-foreground">{video.user?.name || 'Unknown User'}</p>
                                <div className="flex items-center gap-1">
                                    <span>1.2k views</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground h-fit">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
