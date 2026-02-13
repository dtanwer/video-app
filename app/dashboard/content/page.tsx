'use client';

import { useEffect, useState } from 'react';
import { VideoTable } from '@/components/dashboard/video-table';
import { getMyVideos } from '@/lib/api/video';
import { MyVideo } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function ContentPage() {
    const [videos, setVideos] = useState<MyVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalVideos, setTotalVideos] = useState(0);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [visibility, setVisibility] = useState<'all' | 'public' | 'private'>('all');

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoading(true);
            try {
                const response = await getMyVideos(
                    page,
                    limit,
                    debouncedSearch,
                    status === 'all' ? undefined : status,
                    visibility === 'all' ? undefined : visibility
                );
                setVideos(response.data);
                setTotalPages(response.meta.totalPages);
                setTotalVideos(response.meta.total);
            } catch (error) {
                console.error('Failed to fetch videos', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, [page, limit, debouncedSearch, status, visibility, refreshTrigger]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, visibility, limit]);

    return (
        <div className="p-6 space-y-6 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center flex-shrink-0">
                <h1 className="text-2xl font-bold">Channel content</h1>
                <Link href="/video/upload">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-1 max-w-sm">
                        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Filter videos..."
                            className="pl-9 w-[300px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                    {(search || status !== 'all' || visibility !== 'all') && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSearch('');
                                setStatus('all');
                                setVisibility('all');
                            }}
                            className="mr-2"
                        >
                            Reset
                        </Button>
                    )}

                    <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Visibility</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0 max-h-[400px]">
                <VideoTable
                    videos={videos}
                    isLoading={isLoading}
                    onVideoDeleted={() => setRefreshTrigger(prev => prev + 1)}
                />
            </div>

            <div className="flex items-center justify-between flex-shrink-0 pt-2 border-t mt-auto">
                <div className="flex items-center space-x-4">
                    <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder={limit.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-500">
                        Showing {videos.length} of {totalVideos} videos
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || isLoading}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
