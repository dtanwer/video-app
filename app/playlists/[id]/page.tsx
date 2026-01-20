'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash2, Play, Lock, Unlock, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

import { playlistApi, Playlist } from '@/lib/api/playlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { VideoCard } from '@/components/video-card';
import { PaymentModal } from '@/components/payment-modal';
import { TransactionType } from '@/lib/api/payment';
import { useAuth } from '@/lib/auth-context';

export default function PlaylistDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const { user } = useAuth();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadPlaylist(params.id as string);
        }
    }, [params.id]);

    async function loadPlaylist(id: string) {
        try {
            setIsLoading(true);
            const data = await playlistApi.getOne(id);
            setPlaylist(data);

            // Check access
            if (data.isPaid) {
                // Logic to check if user has purchased
                // Simple check: if user is owner, they have access
                if (user && data.ownerId === user.id) {
                    setHasAccess(true);
                } else {
                    // If paid, we need to check if purchased. 
                    // This info should ideally come from backend
                    // For this demo, we'll default to false for paid playlists if not owner
                    setHasAccess(false);
                }
            } else {
                setHasAccess(true);
            }
        } catch (error) {
            toast.error('Failed to load playlist');
            router.push('/playlists');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        if (!playlist) return;
        try {
            await playlistApi.delete(playlist.id);
            toast.success('Playlist deleted');
            router.push('/playlists');
        } catch (error) {
            toast.error('Failed to delete playlist');
        }
    }

    async function handleRemoveVideo(videoId: string) {
        if (!playlist) return;
        try {
            await playlistApi.removeVideo(playlist.id, videoId);
            toast.success('Video removed from playlist');
            loadPlaylist(playlist.id);
        } catch (error) {
            toast.error('Failed to remove video');
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!playlist) return null;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Playlist Info */}
                <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                        {playlist.image ? (
                            <Image
                                src={playlist.image}
                                alt={playlist.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Play className="w-16 h-16 text-muted-foreground/50" />
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">{playlist.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            {playlist.isPaid ? (
                                <Badge variant="secondary">
                                    <Lock className="w-3 h-3 mr-1" />
                                    ${playlist.price}
                                </Badge>
                            ) : (
                                <Badge variant="outline">
                                    <Unlock className="w-3 h-3 mr-1" />
                                    Free
                                </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                                {playlist.videos?.length || 0} videos
                            </span>
                        </div>
                    </div>

                    <p className="text-muted-foreground">{playlist.description}</p>

                    <div className="flex gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Playlist
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        playlist.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Videos List */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">Videos</h2>

                    {!hasAccess && playlist.isPaid ? (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                            <Lock className="w-12 h-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Locked Playlist</h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                Purchase this playlist to access all {playlist.videos?.length || 0} videos.
                            </p>
                            <Button onClick={() => setShowPayment(true)}>
                                Unlock for ${playlist.price}
                            </Button>
                        </div>
                    ) : playlist.videos && playlist.videos.length > 0 ? (
                        <div className="space-y-4">
                            {playlist.videos.map((video) => (
                                <div key={video.id} className="flex gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors group relative">
                                    <div className="w-40 shrink-0">
                                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                                            {video.thumbnail ? (
                                                <img src={video.thumbnail} alt={video.title || 'Video thumbnail'} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                    <Play className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/video/${video.id}`} className="hover:underline">
                                            <h3 className="font-medium line-clamp-1">{video.title}</h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {video.description}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleRemoveVideo(video.id)} className="text-destructive">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove from playlist
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No videos in this playlist yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {playlist && (
                <PaymentModal
                    open={showPayment}
                    onOpenChange={setShowPayment}
                    title={`Unlock ${playlist.title}`}
                    description="Purchase this playlist to get unlimited access to all its videos."
                    price={playlist.price}
                    type={TransactionType.PLAYLIST_PURCHASE}
                    referenceId={playlist.id}
                    onSuccess={() => {
                        setHasAccess(true);
                        setShowPayment(false);
                    }}
                />
            )}
        </div>
    );
}
