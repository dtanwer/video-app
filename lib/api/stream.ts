import axios from 'axios';
import {
    ActiveStreamsResponse,
    StreamInfoResponse,
    StreamActionResponse,
    HealthCheckResponse
} from '@/types/video';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getActiveStreams = async (): Promise<ActiveStreamsResponse> => {
    try {
        const response = await axios.get<ActiveStreamsResponse>(`${API_BASE_URL}/streams`);
        return response.data;
    } catch (error) {
        console.error('Error fetching active streams:', error);
        throw error;
    }
};

export const getStreamInfo = async (streamKey: string): Promise<StreamInfoResponse> => {
    try {
        const response = await axios.get<StreamInfoResponse>(`${API_BASE_URL}/streams/${streamKey}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stream info:', error);
        throw error;
    }
};

export const stopStream = async (streamKey: string): Promise<StreamActionResponse> => {
    try {
        const response = await axios.delete<StreamActionResponse>(`${API_BASE_URL}/streams/${streamKey}`);
        return response.data;
    } catch (error) {
        console.error('Error stopping stream:', error);
        throw error;
    }
};

export const checkStreamHealth = async (): Promise<HealthCheckResponse> => {
    try {
        const response = await axios.get<HealthCheckResponse>(`${API_BASE_URL}/streams/health/check`);
        return response.data;
    } catch (error) {
        console.error('Error checking stream health:', error);
        throw error;
    }
};
