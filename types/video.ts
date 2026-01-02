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
  isLive?: boolean;
}

export interface Video extends VideoSummary {
  description: string;
  sizeBytes: number;
  url: string;
  user: User;
  status: 'pending' | 'processing' | 'completed' | 'failed';
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

export interface StreamQuality {
  resolution: string;
  url: string;
}

export interface Stream {
  streamKey: string;
  startTime: string;
  duration: number;
  hlsUrl: string;
  isActive: boolean;
}

export interface StreamInfo extends Stream {
  qualities: StreamQuality[];
}

export interface ActiveStreamsResponse {
  success: boolean;
  count: number;
  streams: Stream[];
}

export interface StreamInfoResponse {
  success: boolean;
  stream: StreamInfo;
}

export interface StreamActionResponse {
  success: boolean;
  message: string;
}

export interface HealthCheckResponse {
  success: boolean;
  status: string;
  rtmpServer: {
    running: boolean;
    port: number;
  };
  httpServer: {
    running: boolean;
    port: number;
  };
  activeStreams: number;
  uptime: number;
}
