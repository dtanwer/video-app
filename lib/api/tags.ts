import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface Tag {
    id: string;
    name: string;
    slug: string;
    count?: number;
}

export interface TagListResponse {
    data: Tag[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const fetchTags = async (page: number = 1, limit: number = 20, search?: string): Promise<TagListResponse> => {
    try {
        const params: any = { page, limit };
        if (search) {
            params.search = search;
        }
        const response = await axios.get<TagListResponse>(`${API_BASE_URL}/tags`, {
            params,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};
