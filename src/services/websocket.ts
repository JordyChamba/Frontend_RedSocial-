import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Notification } from '@/types/notification';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

let stompClient: Client | null = null;

type NotificationCallback = (notification: Notification) => void;

let notificationCallback: NotificationCallback | null = null;

export const connectWebSocket = (
  userId: number,
  onNotification: (notification: Notification) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      resolve();
      return;
    }

    notificationCallback = onNotification;

    const token = localStorage.getItem('accessToken');

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log('WebSocket connected');
        
        stompClient?.subscribe(
          `/user/${userId}/queue/notifications`,
          (message) => {
            const notification: Notification = JSON.parse(message.body);
            if (notificationCallback) {
              notificationCallback(notification);
            }
          }
        );
        
        resolve();
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        reject(new Error(frame.headers['message']));
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      },
    });

    stompClient.activate();
  });
};

export const disconnectWebSocket = (): void => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    notificationCallback = null;
  }
};

export const isWebSocketConnected = (): boolean => {
  return stompClient?.connected ?? false;
};
