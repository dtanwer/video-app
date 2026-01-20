import Link from 'next/link';
import Image from 'next/image';
import { PlaySquare, Lock, Unlock } from 'lucide-react';
import { Playlist } from '@/lib/api/playlist';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlaylistCardProps {
    playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
    return (
        <Link href={`/playlists/${playlist.id}`}>
            <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer group">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                            {playlist.title}
                        </CardTitle>
                        {playlist.isPaid ? (
                            <Badge variant="secondary" className="ml-2 shrink-0">
                                <Lock className="w-3 h-3 mr-1" />
                                ${playlist.price}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="ml-2 shrink-0">
                                <Unlock className="w-3 h-3 mr-1" />
                                Free
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                        {playlist.image ? (
                            <Image
                                src={playlist.image}
                                alt={playlist.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <PlaySquare className="w-12 h-12 text-muted-foreground/50" />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {playlist.description || 'No description'}
                    </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    {playlist.videos?.length || 0} videos • Updated{' '}
                    {new Date(playlist.updatedAt).toLocaleDateString()}
                </CardFooter>
            </Card>
        </Link>
    );
}
