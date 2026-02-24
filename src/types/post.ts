import { User } from './user';

export interface Post {
  id: number;
  content: string;
  imageUrls?: string[];
  author: User;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
  imageUrls?: string[];
}

export interface UpdatePostRequest {
  content: string;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  postId: number;
  parentCommentId?: number;
  likesCount: number;
  repliesCount: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}
