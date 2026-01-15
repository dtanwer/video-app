'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { playlistApi, Playlist } from '@/lib/api/playlist';

const formSchema = z.object({
    playlistId: z.string().min(1, 'Please select a playlist'),
});

interface AddVideoDialogProps {
    videoId: string;
    onSuccess?: () => void;
}

export function AddVideoDialog({ videoId, onSuccess }: AddVideoDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            playlistId: '',
        },
    });

    useEffect(() => {
        if (open) {
            loadPlaylists();
        }
    }, [open]);

    async function loadPlaylists() {
        try {
            const data = await playlistApi.getAll();
            setPlaylists(data);
        } catch (error) {
            toast.error('Failed to load playlists');
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            await playlistApi.addVideo(values.playlistId, videoId);
            toast.success('Video added to playlist');
            setOpen(false);
            form.reset();
            onSuccess?.();
        } catch (error) {
            toast.error('Failed to add video to playlist');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Playlist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Playlist</DialogTitle>
                    <DialogDescription>
                        Select a playlist to add this video to.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="playlistId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Playlist</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a playlist" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {playlists.map((playlist) => (
                                                <SelectItem key={playlist.id} value={playlist.id}>
                                                    {playlist.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Video
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
