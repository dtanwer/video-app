export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface VideoSummary {
  id: string;
  title: string | null;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface Video extends VideoSummary {
  description: string;
  sizeBytes: number;
  url: string;
  user: User;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListVideoResponse {
  data: VideoSummary[];
  meta: PaginationMeta;
}

export interface MyVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  visibility: 'private' | 'public';
  encodingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  sizeBytes: number;
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
  views: number;
}
