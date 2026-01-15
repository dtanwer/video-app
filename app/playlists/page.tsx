'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { playlistApi, Playlist } from '@/lib/api/playlist';
import { CreatePlaylistDialog } from '@/components/create-playlist-dialog';
import { PlaylistCard } from '@/components/playlist-card';

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPlaylists();
    }, []);

    async function loadPlaylists() {
        try {
            setIsLoading(true);
            const data = await playlistApi.getAll();
            setPlaylists(data);
        } catch (error) {
            toast.error('Failed to load playlists');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your video collections
                    </p>
                </div>
                <CreatePlaylistDialog onSuccess={loadPlaylists} />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : playlists.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-medium">No playlists found</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                        Create your first playlist to get started
                    </p>
                    <CreatePlaylistDialog onSuccess={loadPlaylists} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {playlists.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            )}
        </div>
    );
}
