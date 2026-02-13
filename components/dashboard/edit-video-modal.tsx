'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MyVideo } from '@/types/video';
import { updateVideo, togglePublishStatus } from '@/lib/api/video';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditVideoModalProps {
    video: MyVideo;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVideoUpdated: (updatedVideo: MyVideo) => void;
}

export function EditVideoModal({
    video,
    open,
    onOpenChange,
    onVideoUpdated,
}: EditVideoModalProps) {
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description || '');
    const [visibility, setVisibility] = useState<'public' | 'private'>(
        video.visibility
    );
    // Assuming backend provided isPaid, price. But MyVideo interface might be missing them?
    // Let's check MyVideo interface. It has visibility, title, description.
    // It seems MyVideo interface in `types/video.ts` is missing `isPaid`, `price`, `isPublished`.
    // I need to update MyVideo type first or cast it.
    // The VideoSummary has isPaid, price. MyVideo should probably extend or have them.
    // For now I will assume MyVideo has them or I will just ignore TS error with any cast if needed,
    // but better to fix the type.

    // Actually the user requirements say "change price make it free".
    // I'll check `project/types/video.ts` again. MyVideo has:
    /*
    export interface MyVideo {
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      url: string;
      visibility: 'private' | 'public';
      encodingStatus: 'pending' | 'processing' | 'completed' | 'failed';
      sizeBytes: number;
      durationSeconds: number;
      createdAt: string;
      updatedAt: string;
      views: number;
    }
    */
    // It IS missing price, isPaid, isPublished. I should update the type.

    const [isLoading, setIsLoading] = useState(false);

    // Using any for now to bypass type missing, will fix type next
    const [isPaid, setIsPaid] = useState<boolean>(video.isPaid || false);
    const [price, setPrice] = useState<string>((video.price || 0).toString());
    const [isPublished, setIsPublished] = useState<boolean>(video.isPublished || false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatedData: Partial<MyVideo> = {
                title,
                description,
                visibility,
                isPaid,
                price: isPaid ? parseFloat(price) : 0,
            };

            // Update details
            let updatedVideo = await updateVideo(video.id, updatedData);

            // Handle publish toggle separately if changed
            if (isPublished !== video.isPublished) {
                updatedVideo = await togglePublishStatus(video.id, isPublished);
            }

            onVideoUpdated(updatedVideo);
            toast.success('Video updated successfully');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to update video');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit video details</DialogTitle>
                    <DialogDescription>
                        Make changes to your video here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="visibility">Visibility</Label>
                                <Select
                                    value={visibility}
                                    onValueChange={(v: 'public' | 'private') =>
                                        setVisibility(v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Switch
                                    id="published"
                                    checked={isPublished}
                                    onCheckedChange={setIsPublished}
                                />
                                <Label htmlFor="published">Published</Label>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="paid"
                                checked={isPaid}
                                onCheckedChange={setIsPaid}
                            />
                            <Label htmlFor="paid">Paid Video</Label>
                        </div>

                        {isPaid && (
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (INR)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
