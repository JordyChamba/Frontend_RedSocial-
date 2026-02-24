import apiClient from './api';
import { 
  ApiResponse, 
  CreatePostRequest, 
  PaginatedResponse, 
  Post, 
  UpdatePostRequest 
} from '@/types';

export const postService = {
  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await apiClient.post<ApiResponse<Post>>('/posts', data);
    return response.data.data;
  },

  async getPostById(id: number): Promise<Post> {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data;
  },

  async getAllPosts(page = 0, size = 10): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getPostsByUserId(userId: number, page = 0, size = 10): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts/user/${userId}?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getFeedPosts(page = 0, size = 10): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts/feed?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getTrendingPosts(limit = 10): Promise<Post[]> {
    const response = await apiClient.get<ApiResponse<Post[]>>(`/posts/trending?limit=${limit}`);
    return response.data.data;
  },

  async searchPosts(query: string, page = 0, size = 10): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts/search?query=${query}&page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async updatePost(id: number, data: UpdatePostRequest): Promise<Post> {
    const response = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data.data;
  },

  async deletePost(id: number): Promise<void> {
    await apiClient.delete(`/posts/${id}`);
  },

  async likePost(id: number): Promise<Post> {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${id}/like`);
    return response.data.data;
  },

  async unlikePost(id: number): Promise<Post> {
    const response = await apiClient.delete<ApiResponse<Post>>(`/posts/${id}/unlike`);
    return response.data.data;
  },
};
