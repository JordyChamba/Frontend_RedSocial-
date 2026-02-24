import apiClient from './api';
import { ApiResponse, UpdateProfileRequest, User } from '@/types';

export const userService = {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async getUserByUsername(username: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/username/${username}`);
    return response.data.data;
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users/search?query=${query}`);
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/users/me', data);
    return response.data.data;
  },

  async updateProfileImage(imageUrl: string): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/me/profile-image?imageUrl=${imageUrl}`
    );
    return response.data.data;
  },

  async followUser(userId: number): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(`/users/${userId}/follow`);
    return response.data.data;
  },

  async unfollowUser(userId: number): Promise<User> {
    const response = await apiClient.delete<ApiResponse<User>>(`/users/${userId}/unfollow`);
    return response.data.data;
  },

  async getFollowers(userId: number): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users/${userId}/followers`);
    return response.data.data;
  },

  async getFollowing(userId: number): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users/${userId}/following`);
    return response.data.data;
  },
};
