import axios from 'axios';
import { ListVideoResponse, Video, MyVideo, MyVideoResponse } from '@/types/video';
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
    playbackUrl: string | null;
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

export const getMyVideos = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    visibility?: 'public' | 'private'
): Promise<MyVideoResponse> => {
    try {
        const params: any = { page, limit };
        if (search) params.search = search;
        if (status && status !== 'all') params.status = status;
        if (visibility) params.visibility = visibility;

        const response = await apiClient.get<MyVideoResponse>('/videos/my-videos', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching my videos:', error);
        throw error;
    }
};

export const getSignedUrl = async (id: string): Promise<{ url: string }> => {
    try {
        const response = await apiClient.get<{ url: string }>(`/videos/${id}/signed-url`);
        return response.data;
    } catch (error) {
        console.error('Error fetching signed URL:', error);
        throw error;
    }
};

export const updateVideo = async (id: string, data: Partial<MyVideo>): Promise<MyVideo> => {
    try {
        const response = await apiClient.patch<MyVideo>(`/videos/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating video:', error);
        throw error;
    }
};

export const togglePublishStatus = async (id: string, isPublished: boolean): Promise<MyVideo> => {
    try {
        const response = await apiClient.patch<MyVideo>(`/videos/${id}/publish`, { isPublished });
        return response.data;
    } catch (error) {
        console.error('Error toggling publish status:', error);
        throw error;
    }
};

export const deleteVideo = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/videos/${id}`);
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
};