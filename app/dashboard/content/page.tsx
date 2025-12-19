'use client';

import { useEffect, useState } from 'react';
import { VideoTable } from '@/components/dashboard/video-table';
import { getMyVideos } from '@/lib/api/video';
import { MyVideo } from '@/types/video';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ContentPage() {
    const [videos, setVideos] = useState<MyVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getMyVideos();
                setVideos(data);
            } catch (error) {
                console.error('Failed to fetch videos', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Channel content</h1>
                <Link href="/video/upload">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                    </Button>
                </Link>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Filter"
                        className="pl-9"
                    />
                </div>
            </div>

            <VideoTable videos={videos} isLoading={isLoading} />
        </div>
    );
}
