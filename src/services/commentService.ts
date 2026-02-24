import apiClient from './api';
import { ApiResponse, Comment, CreateCommentRequest, PaginatedResponse } from '@/types';

export const commentService = {
  async createComment(postId: number, data: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/posts/${postId}/comments`,
      data
    );
    return response.data.data;
  },

  async getCommentsByPostId(
    postId: number,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Comment>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Comment>>>(
      `/posts/${postId}/comments?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getReplies(commentId: number): Promise<Comment[]> {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/comments/${commentId}/replies`
    );
    return response.data.data;
  },

  async updateComment(commentId: number, content: string): Promise<Comment> {
    const response = await apiClient.put<ApiResponse<Comment>>(`/comments/${commentId}`, {
      content,
    });
    return response.data.data;
  },

  async deleteComment(commentId: number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
