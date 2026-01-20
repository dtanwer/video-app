import { apiClient } from '@/lib/auth';
import { Video } from '@/types/video';

export interface Playlist {
    id: string;
    title: string;
    description?: string;
    isPaid: boolean;
    price: number;
    ownerId: string;
    videos: Video[];
    createdAt: string;
    updatedAt: string;
    image?: string;
}

export interface CreatePlaylistDto {
    title: string;
    description?: string;
    isPaid?: boolean;
    price?: number;
    image?: File;
}

export interface UpdatePlaylistDto {
    title?: string;
    description?: string;
    isPaid?: boolean;
    price?: number;
}

export const playlistApi = {
    create: async (data: CreatePlaylistDto | FormData): Promise<Playlist> => {
        const isFormData = data instanceof FormData;
        const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
        const response = await apiClient.post<Playlist>('/playlists', data, { headers });
        return response.data;
    },

    getAll: async (): Promise<Playlist[]> => {
        const response = await apiClient.get<Playlist[]>('/playlists');
        return response.data;
    },

    getOne: async (id: string): Promise<Playlist> => {
        const response = await apiClient.get<Playlist>(`/playlists/${id}`);
        return response.data;
    },

    update: async (id: string, data: UpdatePlaylistDto): Promise<Playlist> => {
        const response = await apiClient.patch<Playlist>(`/playlists/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/playlists/${id}`);
    },

    addVideo: async (playlistId: string, videoId: string): Promise<void> => {
        await apiClient.post(`/playlists/${playlistId}/videos/${videoId}`);
    },

    removeVideo: async (playlistId: string, videoId: string): Promise<void> => {
        await apiClient.delete(`/playlists/${playlistId}/videos/${videoId}`);
    },
};
