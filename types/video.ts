export interface Video {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  url: string;       // HLS Master Playlist URL (.m3u8)
  thumbnail: string; // Thumbnail Image URL (.jpg)
}

export interface PaginationMeta {
  total: number;      // Total number of videos available
  page: number;       // Current page number
  limit: number;      // Items per page
  totalPages: number; // Total number of pages
}

export interface ListVideoResponse {
  data: Video[];
  meta: PaginationMeta;
}
