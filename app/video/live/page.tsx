'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createLiveStream, LiveStreamResponse } from '@/lib/api/video';
import { stopStream } from '@/lib/api/stream';
import { VideoPlayer } from '@/components/video-player';
import { Copy, Check, Radio, AlertCircle, StopCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GoLivePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamData, setStreamData] = useState<LiveStreamResponse | null>(null);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [error, setError] = useState('');
    const [isStreamReady, setIsStreamReady] = useState(false);

    if (!user) {
        router.push('/login');
        return null;
    }

    // Poll for stream availability
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const checkStream = async () => {
            if (streamData?.playbackUrl && !isStreamReady) {
                try {
                    const response = await fetch(streamData.playbackUrl, { method: 'HEAD' });
                    if (response.ok) {
                        setIsStreamReady(true);
                    }
                } catch (e) {
                    // Stream not ready yet, ignore error
                }
            }
        };

        if (streamData && !isStreamReady) {
            checkStream(); // Check immediately
            intervalId = setInterval(checkStream, 3000); // Check every 3 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [streamData, isStreamReady]);

    const handleCreateStream = async () => {
        setLoading(true);
        setError('');
        setIsStreamReady(false);
        try {
            const data = await createLiveStream({ title, description });
            setStreamData(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create live stream');
        } finally {
            setLoading(false);
        }
    };

    const handleStopStream = async () => {
        if (!streamData) return;
        setLoading(true);
        try {
            await stopStream(streamData.streamKey);
            setStreamData(null);
            setTitle('');
            setDescription('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to stop stream');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, isKey: boolean) => {
        navigator.clipboard.writeText(text);
        if (isKey) {
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        } else {
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-8">
                <Radio className="h-6 w-6 text-red-600 animate-pulse" />
                <h1 className="text-3xl font-bold">Go Live</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Video Player */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                        {streamData ? (
                            isStreamReady ? (
                                <VideoPlayer
                                    src={streamData.playbackUrl}
                                    poster="/placeholder-stream.jpg"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 animate-pulse">
                                    <Radio className="h-16 w-16 mb-4 opacity-50" />
                                    <p className="text-lg">Waiting for stream...</p>
                                    <p className="text-sm">Start streaming from your software</p>
                                </div>
                            )
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <Radio className="h-16 w-16 mb-4 opacity-50" />
                                <p className="text-lg">Stream not started</p>
                                <p className="text-sm">Create a stream to get started</p>
                            </div>
                        )}
                    </div>

                    {streamData && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                The stream may take a few moments to start after you begin streaming from your software.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Right Column: Controls */}
                <div className="space-y-6">
                    {!streamData ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Stream Details</CardTitle>
                                <CardDescription>Enter details to create your live stream</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="My Awesome Stream"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Tell viewers about your stream..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <Button
                                    className="w-full"
                                    onClick={handleCreateStream}
                                    disabled={loading || !title}
                                >
                                    {loading ? 'Creating...' : 'Create Stream'}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Stream Settings</CardTitle>
                                <CardDescription>Use these settings in your streaming software (OBS, etc.)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Stream URL</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value={streamData.rtmpUrl} className="bg-muted" />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(streamData.rtmpUrl, false)}
                                        >
                                            {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Stream Key</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value={streamData.streamKey} type="password" className="bg-muted" />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(streamData.streamKey, true)}
                                        >
                                            {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-red-500">
                                        Keep your stream key secret! Anyone with this key can stream to your channel.
                                    </p>
                                </div>

                                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                                    <p className="font-semibold">Instructions:</p>
                                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                        <li>Open OBS or your streaming software</li>
                                        <li>Go to Settings &gt; Stream</li>
                                        <li>Select "Custom..." as Service</li>
                                        <li>Paste the Stream URL into "Server"</li>
                                        <li>Paste the Stream Key into "Stream Key"</li>
                                        <li>Start Streaming!</li>
                                    </ol>
                                </div>

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleStopStream}
                                    disabled={loading}
                                >
                                    <StopCircle className="mr-2 h-4 w-4" />
                                    Stop Stream
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
