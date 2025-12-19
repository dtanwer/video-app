'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '@/components/video-grid';
import { fetchVideos } from '@/lib/api/video';
import { Video } from '@/types/video';
import { Loader2, VideoOff } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { VideoSummary } from '@/types/video';
import { fetchTags, Tag } from '@/lib/api/tags';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Home() {
  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetchTags(1, 50);
        setTags(response.data);
      } catch (error) {
        console.error('Failed to load tags:', error);
      }
    };
    loadTags();
  }, []);

  const loadVideos = async (pageNum: number, isNewSearch: boolean = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      }
      const response = await fetchVideos(pageNum, 12, debouncedSearch, selectedTag ? [selectedTag] : undefined);
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
    setPage(1);
    loadVideos(1, true);
  }, [debouncedSearch, selectedTag]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVideos(nextPage, false);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <div className="container py-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-2 pb-4">
            <Badge
              variant={selectedTag === null ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.name ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {videos.length > 0 ? (
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
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <VideoOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No videos available</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  There are no videos to display at the moment. Be the first to upload one!
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/video/upload">Upload Video</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}