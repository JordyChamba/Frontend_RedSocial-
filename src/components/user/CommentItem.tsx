import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { FiMoreVertical, FiCornerDownRight } from 'react-icons/fi';
import { Comment } from '@/types';
import { commentService } from '@/services/commentService';
import { useAuthStore } from '@/store/authStore';
import Button from '../auth/Button';
import Input from '../auth/Input';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onReplyClick?: () => void;
}

export default function CommentItem({ comment, postId, onReplyClick }: CommentItemProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const isOwnComment = currentUser?.id === comment.author.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () => commentService.updateComment(comment.id, editContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setIsEditing(false);
      toast.success('Comment updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentService.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Comment deleted!');
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleUpdate = () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <Link to={`/profile/${comment.author.username}`}>
        {comment.author.profileImageUrl ? (
          <img
            src={comment.author.profileImageUrl}
            alt={comment.author.username}
            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-bold">
              {comment.author.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl px-4 py-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <Link
              to={`/profile/${comment.author.username}`}
              className="font-semibold text-gray-900 hover:underline text-sm"
            >
              {comment.author.fullName || comment.author.username}
            </Link>

            {isOwnComment && !isEditing && (
              <div className="relative group">
                <button className="p-1 text-gray-500 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMoreVertical size={16} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-[120px]">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content or Edit Form */}
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpdate} isLoading={updateMutation.isPending}>
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
          <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          {onReplyClick && (
            <button
              onClick={onReplyClick}
              className="hover:text-primary-600 font-medium"
            >
              Reply
            </button>
          )}
          {comment.repliesCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:text-primary-600 font-medium flex items-center gap-1"
            >
              <FiCornerDownRight size={12} />
              {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
