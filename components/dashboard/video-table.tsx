'use client';

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
import { MyVideo } from '@/types/video';
import Image from 'next/image';

interface VideoTableProps {
    videos: MyVideo[];
    isLoading: boolean;
}

export function VideoTable({ videos, isLoading }: VideoTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                    <div className="relative h-16 w-28 bg-gray-100 rounded overflow-hidden">
                                        {video.thumbnail ? (
                                            <Image
                                                src={video.thumbnail}
                                                alt={video.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                                No Thumb
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold line-clamp-1">{video.title}</span>
                                        <span className="text-xs text-gray-500 line-clamp-1">
                                            {video.description}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    {video.visibility === 'public' ? (
                                        <Eye className="h-4 w-4 mr-2 text-green-500" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 mr-2 text-gray-500" />
                                    )}
                                    <span className="capitalize">{video.visibility}</span>
                                </div>
                            </TableCell>
                            <TableCell>
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
                            <TableCell>
                                {new Date(video.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{video.views}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                                        <DropdownMenuItem>Get shareable link</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            Delete video
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
