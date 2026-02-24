import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '@/types';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/store/authStore';
import { clsx } from 'clsx';
import CommentSection from '../user/CommentSection';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const isOwnPost = currentUser?.id === post.author.id;
  const [showComments, setShowComments] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () =>
      post.isLiked ? postService.unlikePost(post.id) : postService.likePost(post.id),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['feed'] });

      // Update cache optimistically
      const updatePost = (oldPost: Post) => {
        if (oldPost.id === post.id) {
          return {
            ...oldPost,
            isLiked: !oldPost.isLiked,
            likesCount: oldPost.isLiked ? oldPost.likesCount - 1 : oldPost.likesCount + 1,
          };
        }
        return oldPost;
      };

      queryClient.setQueriesData({ queryKey: ['posts'] }, (old: any) => ({
        ...old,
        pages: old?.pages?.map((page: any) => ({
          ...page,
          content: page.content.map(updatePost),
        })),
      }));

      queryClient.setQueriesData({ queryKey: ['feed'] }, (old: any) => ({
        ...old,
        pages: old?.pages?.map((page: any) => ({
          ...page,
          content: page.content.map(updatePost),
        })),
      }));
    },
    onError: () => {
      toast.error('Failed to update like');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3">
          {post.author.profileImageUrl ? (
            <img
              src={post.author.profileImageUrl}
              alt={post.author.username}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 hover:underline">
                {post.author.fullName || post.author.username}
              </p>
              {post.author.verified && (
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500">
              @{post.author.username} •{' '}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </Link>

        {isOwnPost && (
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <FiMoreVertical size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap break-words">{post.content}</p>
      </div>

      {/* Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={post.imageUrls[0]}
            alt="Post"
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-200">
        <button
          onClick={handleLike}
          className={clsx(
            'flex items-center gap-2 transition-colors',
            post.isLiked
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-500 hover:text-red-500'
          )}
        >
          <FiHeart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
          <span className="font-medium">{post.likesCount}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className={clsx(
            'flex items-center gap-2 transition-colors',
            showComments 
              ? 'text-primary-600' 
              : 'text-gray-500 hover:text-primary-600'
          )}
        >
          <FiMessageCircle size={20} />
          <span className="font-medium">{post.commentsCount}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
          <FiShare2 size={20} />
          <span className="font-medium">{post.sharesCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}
