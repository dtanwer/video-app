'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '@/components/video-grid';
import { fetchVideos } from '@/lib/api/video';
import { Video } from '@/types/video';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadVideos = async (pageNum: number) => {
    try {
      const response = await fetchVideos(pageNum, 12);
      if (pageNum === 1) {
        setVideos(response.data);
      } else {
        setVideos((prev) => [...prev, ...response.data]);
      }
      setHasMore(response.meta.page < response.meta.totalPages);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVideos(nextPage);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}


      {/* Main Content */}
      <main className="container py-6">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <VideoGrid videos={videos} />

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}