import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/store/authStore';
import Button from '../auth/Button';

export default function CreatePost() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState('');

  const createPostMutation = useMutation({
    mutationFn: () => postService.createPost({ content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setContent('');
      toast.success('Post created!');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post cannot be empty');
      return;
    }
    createPostMutation.mutate();
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.username}
              className="h-12 w-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 font-bold text-xl">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-500">{content.length}/500</p>
              <Button
                type="submit"
                size="md"
                isLoading={createPostMutation.isPending}
                disabled={!content.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
