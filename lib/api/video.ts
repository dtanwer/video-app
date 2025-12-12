import axios from 'axios';
import { ListVideoResponse, Video } from '@/types/video';

// Use an environment variable for the API URL if available, otherwise fallback to localhost or relative path
// Since the user request implies a relative path /video, we might be hitting our own Next.js API or an external one.
// The user gave an example response but didn't specify the base URL.
// "GET /video?page=1&limit=10" implies a relative path or a known API base.
// I'll assume a relative path for now, or use a placeholder if it's meant to be external.
// Given "Integration Notes", it seems like we are integrating with an existing API.
// I'll use a relative path `/api/video` if it's a Next.js API route, or just `/video` if it's proxied.
// Wait, the request says "GET /video". If I'm in the browser, `/video` would hit the frontend route.
// It likely means `GET /api/video` or an external API.
// However, usually in these tasks, if not specified, it might be a mock or a specific backend URL.
// I will check .env to see if there is a backend URL.
// For now I will write a generic fetcher.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const fetchVideos = async (page: number = 1, limit: number = 10): Promise<ListVideoResponse> => {
    try {
        const response = await axios.get<ListVideoResponse>(`${API_BASE_URL}/video`, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

export const fetchVideoById = async (id: string): Promise<Video | null> => {
    // This is a placeholder if we need to fetch a single video.
    // Since the user didn't specify an endpoint for single video, we might have to filter from the list
    // or assume the list is the only way.
    // But for a detail page, we usually need this.
    // I'll implement a "get from list" fallback or a direct call if supported.
    // For now, I'll leave it as a TODO or try to fetch list and find.
    // Actually, better to just fetch the list and find it for now to be safe, 
    // or assume the user will provide the endpoint later.
    // Let's try to hit /video/id just in case, or just return null.
    // User said: "when we open any video we will update recomendation later... for now show the desing"
    // So maybe I can pass the video object via state (query params or context) or just fetch the list and find it.
    // I'll fetch the list and find it for now as it's safer without a specific endpoint.
    try {
        const response = await fetchVideos(1, 100); // Fetch a bunch to find it
        return response.data.find((v) => v.id === id) || null;
    } catch (error) {
        console.error("Error fetching video details", error);
        return null;
    }
}
