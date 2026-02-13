'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { MyVideo } from '@/types/video';
import Image from 'next/image';
import { EditVideoModal } from './edit-video-modal';
import { deleteVideo } from '@/lib/api/video';
import { toast } from 'sonner';

interface VideoTableProps {
    videos: MyVideo[];
    isLoading: boolean;
    onVideoDeleted?: (id: string) => void;
}

import { Skeleton } from '@/components/ui/skeleton';

export function VideoTable({ videos: initialVideos, isLoading, onVideoDeleted }: VideoTableProps) {
    const [videos, setVideos] = useState<MyVideo[]>(initialVideos);
    const [editingVideo, setEditingVideo] = useState<MyVideo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Sync state with props
    useEffect(() => {
        setVideos(initialVideos);
    }, [initialVideos]);

    const handleVideoUpdated = (updatedVideo: MyVideo) => {
        setVideos(videos.map(v => v.id === updatedVideo.id ? updatedVideo : v));
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteVideo(id);
            setVideos(videos.filter(v => v.id !== id));
            toast.success('Video deleted');
            if (onVideoDeleted) {
                onVideoDeleted(id);
            }
        } catch (error) {
            toast.error('Failed to delete video');
        }
    };

    return (
        <TooltipProvider>
            <div className="rounded-md border flex flex-col h-[500px] bg-card">
                {/* Header separately to keep sticky */}
                <div className="border-b bg-muted/50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px] max-w-[300px]">Video</TableHead>
                                <TableHead className="w-[100px] max-w-[100px]">Visibility</TableHead>
                                <TableHead className="w-[100px] max-w-[100px]">Status</TableHead>
                                <TableHead className="w-[150px] max-w-[150px]">Date</TableHead>
                                <TableHead className="w-[100px] max-w-[100px]">Views</TableHead>
                                <TableHead className="text-right w-[100px] max-w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>

                <div className="overflow-y-auto flex-1">
                    <Table>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="h-14">
                                        <TableCell className="w-[300px] max-w-[300px]">
                                            <div className="flex items-center space-x-3">
                                                <Skeleton className="h-10 w-16 rounded" />
                                                <div className="flex flex-col space-y-1 flex-1">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : videos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                videos.map((video) => (
                                    <TableRow key={video.id} className="h-14">
                                        <TableCell className="font-medium w-[100px] max-w-[300px]">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative h-10 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                                    {video.thumbnail ? (
                                                        <Image
                                                            src={video.thumbnail}
                                                            alt={video.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                                            No Thumb
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="font-semibold line-clamp-1 truncate cursor-default max-w-full" title={video.title}>{video.title}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{video.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="text-xs text-muted-foreground line-clamp-1 truncate cursor-default max-w-full" title={video.description}>
                                                                {video.description}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs">{video.description}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[100px] max-w-[100px]">
                                            <div className="flex items-center">
                                                {video.visibility === 'public' ? (
                                                    <Eye className="h-4 w-4 mr-2 text-green-500" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
                                                )}
                                                <span className="capitalize">{video.visibility}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[100px] max-w-[100px]">
                                            <Badge
                                                variant={
                                                    video.encodingStatus === 'completed'
                                                        ? 'default'
                                                        : video.encodingStatus === 'failed'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                }
                                            >
                                                {video.encodingStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="w-[150px] max-w-[150px]">
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="w-[100px] max-w-[100px]">{video.views}</TableCell>
                                        <TableCell className="text-right w-[100px] max-w-[100px]">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditingVideo(video);
                                                        setIsEditModalOpen(true);
                                                    }}>
                                                        Edit details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Get shareable link</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(video.id)}
                                                    >
                                                        Delete video
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {editingVideo && (
                    <EditVideoModal
                        video={editingVideo}
                        open={isEditModalOpen}
                        onOpenChange={(open) => {
                            setIsEditModalOpen(open);
                            if (!open) setEditingVideo(null);
                        }}
                        onVideoUpdated={handleVideoUpdated}
                    />
                )}
            </div>
        </TooltipProvider>
    );
}
