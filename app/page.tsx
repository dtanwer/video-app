'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VideoGrid } from '@/components/video-grid';
import { fetchVideos } from '@/lib/api/video';
import { VideoSummary } from '@/types/video';
import { Loader2, VideoOff } from 'lucide-react';
import Link from 'next/link';
import { fetchTags, Tag } from '@/lib/api/tags';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const [videos, setVideos] = useState<VideoSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
      const response = await fetchVideos(pageNum, 12, search, selectedTag ? [selectedTag] : undefined);
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
  }, [search, selectedTag]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVideos(nextPage, false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Filter Section */}
      <div className="sticky top-16 z-40 bg-background border-b border-border py-4 shadow-sm">
        <div className="container">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 px-1">
              <Badge
                variant={selectedTag === null ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all ${selectedTag === null ? 'bg-primary hover:bg-primary/90' : 'hover:bg-white/10 border-white/10'}`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTag === tag.name ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 rounded-full transition-all ${selectedTag === tag.name ? 'bg-primary hover:bg-primary/90' : 'hover:bg-white/10 border-white/10'}`}
                  onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        {loading && page === 1 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {videos.length > 0 ? (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {search ? `Results for "${search}"` : selectedTag ? `${selectedTag} Videos` : 'Trending Now'}
                  </h2>
                </div>

                <VideoGrid videos={videos} />

                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="rounded-full px-8 border-white/10 hover:bg-white/5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Videos'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                <div className="rounded-full bg-white/5 p-8 ring-1 ring-white/10">
                  <VideoOff className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No videos found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any videos matching your criteria. Try adjusting your search or filters.
                  </p>
                </div>
                <Button className="rounded-full" asChild>
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