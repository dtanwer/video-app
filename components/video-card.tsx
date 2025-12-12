'use client';

import { Video } from '@/types/video';
import { motion } from 'framer-motion';
import { Play, Clock, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface VideoCardProps {
    video: Video;
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
                        alt={video.title}
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

                    {/* Duration Badge (Mocked for now as it's not in API) */}
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                        12:45
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-base font-semibold leading-tight tracking-tight text-foreground group-hover:text-primary">
                            {video.title}
                        </h3>
                        <button className="text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {video.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Views (Mocked) */}
                        <span>•</span>
                        <span>1.2k views</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
