'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchVideoById } from '@/lib/api/video';
import { Video } from '@/types/video';
import { VideoPlayer } from '@/components/video-player';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';

export default function VideoPage() {
    const params = useParams();
    const id = params.id as string;
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const loadVideo = async () => {
            try {
                // Only set loading on first fetch
                if (!video) setLoading(true);

                const data = await fetchVideoById(id);
                setVideo(data);

                // If processing, poll every 3 seconds
                if (data.status === 'pending' || data.status === 'processing') {
                    if (!intervalId) {
                        intervalId = setInterval(async () => {
                            try {
                                const updatedData = await fetchVideoById(id);
                                setVideo(updatedData);

                                // Stop polling if completed or failed
                                if (updatedData.status === 'completed' || updatedData.status === 'failed') {
                                    clearInterval(intervalId);
                                }
                            } catch (err) {
                                // Ignore polling errors
                            }
                        }, 3000);
                    }
                } else if (intervalId) {
                    clearInterval(intervalId);
                }
            } catch (err) {
                setError('Failed to load video');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadVideo();
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [id]);

    if (loading) {
        return (
            <div className="container py-6 space-y-6">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                <h2 className="text-2xl font-bold">Video not found</h2>
                <p className="text-muted-foreground">The video you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className="container py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-lg overflow-hidden border bg-black">
                        {video.status === 'completed' ? (
                            <VideoPlayer
                                src={video.url}
                                poster={video.thumbnail}
                            />
                        ) : video.status === 'failed' ? (
                            <div className="aspect-video flex flex-col items-center justify-center text-destructive p-6 text-center">
                                <AlertCircle className="h-12 w-12 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Processing Failed</h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    We encountered an error while processing your video. Please try uploading it again.
                                </p>
                            </div>
                        ) : (
                            <div className="aspect-video flex flex-col items-center justify-center text-center p-6 bg-muted/10">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                                    <div className="relative bg-background p-4 rounded-full border shadow-sm">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Processing Video</h3>
                                <p className="text-sm text-muted-foreground max-w-md mb-6">
                                    We're preparing your video for playback. This may take a few minutes depending on the file size.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                                    {video.status === 'pending' ? 'Pending in queue...' : 'Encoding in progress...'}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold">{video.title || 'Untitled Video'}</h1>

                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={video.user?.avatar} />
                                    <AvatarFallback>{video.user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{video.user?.name || 'Unknown User'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap text-sm">{video.description}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {/* Placeholder for recommendations */}
                    <Card>
                        <CardHeader className="pb-3">
                            <h3 className="font-semibold">Up Next</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No recommendations available yet.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
