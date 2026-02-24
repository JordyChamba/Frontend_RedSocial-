import { User } from './user';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  sender?: User;
  postId?: number;
  commentId?: number;
  isRead: boolean;
  createdAt: string;
}
