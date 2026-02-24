import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationStore } from '@/store/notificationStore';
import { notificationService } from '@/services/notificationService';
import { NotificationType } from '@/types/notification';

export default function NotificationsPage() {
  const { notifications, setNotifications, markAsRead, unreadCount } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications(0, 50);
        setNotifications(data.content);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [setNotifications]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LIKE:
        return '❤️';
      case NotificationType.COMMENT:
        return '💬';
      case NotificationType.REPLY:
        return '↩️';
      case NotificationType.FOLLOW:
        return '👤';
      case NotificationType.MENTION:
        return '@';
      default:
        return '🔔';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="card p-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">
          {unreadCount > 0 ? `${unreadCount} unread notifications` : 'Stay updated with your activity'}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">No notifications yet</p>
          <p className="text-sm text-gray-400">
            We'll notify you when something happens
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => {
                if (!notification.isRead) {
                  handleMarkAsRead(notification.id);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900">
                    {notification.sender?.username && (
                      <Link
                        to={`/profile/${notification.sender.username}`}
                        className="font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notification.sender.username}
                      </Link>
                    )}
                    {' '}{notification.message.replace(/^[^\s]+\s/, '')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {notification.postId && (
                  <Link
                    to={`/post/${notification.postId}`}
                    className="text-sm text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View post
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
