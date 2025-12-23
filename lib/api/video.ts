import axios from 'axios';
import { ListVideoResponse, Video, MyVideo } from '@/types/video';
import { apiClient } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const fetchVideos = async (page: number = 1, limit: number = 10, search?: string, tags?: string[]): Promise<ListVideoResponse> => {
    try {
        const params: any = { page, limit };
        if (search) {
            params.search = search;
        }
        if (tags && tags.length > 0) {
            params.tag = tags[0];
        }
        const response = await axios.get<ListVideoResponse>(`${API_BASE_URL}/videos`, {
            params,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

export const fetchVideoById = async (id: string): Promise<Video> => {
    try {
        const response = await axios.get<Video>(`${API_BASE_URL}/videos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching video details:', error);
        throw error;
    }
};

export interface LiveStreamResponse {
    videoId: string;
    streamKey: string;
    rtmpUrl: string;
    playbackUrl: string;
}

export const createLiveStream = async (data: { title?: string; description?: string }): Promise<LiveStreamResponse> => {
    try {
        const response = await apiClient.post<LiveStreamResponse>('/videos/live', data);
        return response.data;
    } catch (error) {
        console.error('Error creating live stream:', error);
        throw error;
    }
};

export const getMyVideos = async (): Promise<MyVideo[]> => {
    try {
        const response = await apiClient.get<MyVideo[]>('/video/my-videos');
        return response.data;
    } catch (error) {
        console.error('Error fetching my videos:', error);
        throw error;
    }
};
