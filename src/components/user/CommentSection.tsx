import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { commentService } from '@/services/commentService';
import { useAuthStore } from '@/store/authStore';
import CommentItem from './CommentItem';
import Button from '../auth/Button';
import Loading from '../auth/Loading';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getCommentsByPostId(postId, 0, 20),
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) =>
      commentService.createComment(postId, {
        content,
        parentCommentId: replyingTo || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentText('');
      setReplyingTo(null);
      toast.success('Comment added!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    createCommentMutation.mutate(commentText);
  };

  const comments = data?.content || [];

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      {/* Create Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          {/* User Avatar */}
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.username}
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Input */}
          <div className="flex-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={2000}
            />
            {replyingTo && (
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-xs text-gray-500 hover:text-gray-700 mt-1 ml-4"
              >
                Cancel reply
              </button>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="md"
            isLoading={createCommentMutation.isPending}
            disabled={!commentText.trim()}
          >
            Post
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loading text="Loading comments..." />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplyClick={() => setReplyingTo(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
