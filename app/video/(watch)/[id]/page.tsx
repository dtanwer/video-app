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
        const loadVideo = async () => {
            try {
                setLoading(true);
                const data = await fetchVideoById(id);
                setVideo(data);
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
                        <VideoPlayer
                            src={video.url}
                            poster={video.thumbnail}
                        />
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
