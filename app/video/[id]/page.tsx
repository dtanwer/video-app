'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Video } from '@/types/video';
import { fetchVideos, fetchVideoById } from '@/lib/api/video';
import { VideoPlayer } from '@/components/video-player';
import { VideoCard } from '@/components/video-card';
import { Loader2, ThumbsUp, ThumbsDown, Share2, MessageSquare, CloudCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function VideoPage() {
    const params = useParams();
    const id = params.id as string;

    const [video, setVideo] = useState<Video | null>(null);
    const [recommendations, setRecommendations] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch video details
                // Since we don't have a direct endpoint for single video in the prompt description,
                // we are using our helper which might fetch list and find.
                // Or if the API supports it, great.
                // For recommendations, we fetch the list.

                const [videoData, recData] = await Promise.all([
                    fetchVideoById(id),
                    fetchVideos(1, 10) // Fetch first page for recommendations
                ]);

                setVideo(videoData);
                console.log(videoData);
                // Filter out current video from recommendations
                setRecommendations(recData.data.filter(v => v.id !== id));
            } catch (error) {
                console.error('Error loading video data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="flex min-h-screen items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold">Video not found</h1>
                <Link href="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header (Simplified) */}


            <main className="container py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content: Player + Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <VideoPlayer url={video.url} thumbnail={video.thumbnail} />

                        <div className="space-y-4">
                            <h1 className="text-xl font-bold md:text-2xl">{video.title}</h1>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {/* Mocked stats */}
                                    <span>12K views</span>
                                    <span>•</span>
                                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                                        <ThumbsUp className="h-4 w-4" />
                                        1.2K
                                    </Button>
                                    <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                                        <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="rounded-xl bg-muted/50 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-semibold text-sm">Description</p>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{video.description}</p>
                            </div>

                            {/* Comments Section (Placeholder) */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Comments
                                </h3>
                                <p className="text-muted-foreground text-sm">Comments coming soon...</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Recommendations */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg">Recommended</h2>
                        <div className="flex flex-col gap-4">
                            {recommendations.map((recVideo) => (
                                <Link key={recVideo.id} href={`/video/${recVideo.id}`} className="group flex gap-2">
                                    <div className="relative aspect-video w-40 flex-none overflow-hidden rounded-lg bg-muted">
                                        <img
                                            src={recVideo.thumbnail}
                                            alt={recVideo.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
                                            {recVideo.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Channel Name</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <span>5K views</span>
                                            <span>•</span>
                                            <span>2 days ago</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
