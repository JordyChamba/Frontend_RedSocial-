import apiClient from './api';
import { Notification } from '@/types/notification';

export interface NotificationsResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const notificationService = {
  getNotifications: async (page = 0, size = 20): Promise<NotificationsResponse> => {
    const response = await apiClient.get('/notifications', {
      params: { page, size },
    });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data;
  },

  markAsRead: async (notificationId: number): Promise<Notification> => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },

  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  deleteAllNotifications: async (): Promise<void> => {
    await apiClient.delete('/notifications');
  },
};
