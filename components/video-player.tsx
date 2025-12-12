'use client';

import { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// @ts-ignore
import 'videojs-contrib-quality-menu';
import Player from 'video.js/dist/types/player';

interface VideoPlayerProps {
    url: string;
    thumbnail?: string;
}

export function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
    const videoRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<Player | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        // Initialize player
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, {
                controls: true,
                autoplay: true,
                poster: thumbnail,
                fluid: true, // Make it responsive
                html5: {
                    vhs: {
                        maxBufferLength: 30,
                        maxPlaylistRetries: 3,
                    },
                },
                controlBar: {
                    children: [
                        "playToggle",
                        "volumePanel",
                        "currentTimeDisplay",
                        "timeDivider",
                        "durationDisplay",
                        "progressControl",
                        "liveDisplay",
                        "remainingTimeDisplay",
                        "playbackRateMenuButton",
                        "qualitySelector",
                        "fullscreenToggle",
                    ],
                },
                sources: [{ src: url, type: "application/x-mpegURL" }],
            }, () => {
                videojs.log('player is ready');
                // @ts-ignore
                if (player.qualityMenu) {
                    // @ts-ignore
                    player.qualityMenu();
                }
            });
        } else {
            // Update player
            const player = playerRef.current;
            player.src({ src: url, type: "application/x-mpegURL" });
            if (thumbnail) {
                player.poster(thumbnail);
            }
        }

        return () => {
            // Dispose player on unmount
            // We check if the player exists and hasn't been disposed
            if (playerRef.current && !playerRef.current.isDisposed()) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [url, thumbnail]);

    return (
        <div data-vjs-player className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <div ref={videoRef} className="w-full h-full" />
        </div>
    );
}
