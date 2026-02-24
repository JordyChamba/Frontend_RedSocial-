import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { postService } from '@/services/postService';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/auth/Loading';
import Button from '@/components/auth/Button';
import PostCard from '@/components/post/PostCard';
import FollowButton from '@/components/user/FollowButton';
import EditProfileModal from '@/components/user/EditProfileModal';
import { FiCalendar, FiMapPin, FiLink, FiEdit2 } from 'react-icons/fi';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore((state) => state.user);
  const isOwnProfile = currentUser?.username === username;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => userService.getUserByUsername(username!),
    enabled: !!username,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', 'user', user?.id],
    queryFn: () => postService.getPostsByUserId(user!.id, 0, 10),
    enabled: !!user?.id,
  });

  if (userLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const posts = postsData?.content || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600 rounded-t-lg -mx-4 -mt-4" />

        {/* Profile Info */}
        <div className="relative px-4 pb-4">
          {/* Avatar */}
          <div className="absolute -top-16">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.username}
                className="h-32 w-32 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white">
                <span className="text-primary-600 font-bold text-5xl">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="pt-20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.fullName || user.username}
                  </h1>
                  {user.verified && (
                    <svg className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-gray-600">@{user.username}</p>
              </div>

              {/* Follow/Edit Button */}
              {isOwnProfile ? (
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline"
                  size="md"
                >
                  <FiEdit2 className="mr-2" />
                  Edit Profile
                </Button>
              ) : (
                user.isFollowing !== undefined && (
                  <FollowButton
                    userId={user.id}
                    isFollowing={user.isFollowing}
                    username={user.username}
                  />
                )
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="mt-4 text-gray-700">{user.bio}</p>
            )}

            {/* Details */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              {user.location && (
                <div className="flex items-center gap-1">
                  <FiMapPin size={16} />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 hover:underline"
                >
                  <FiLink size={16} />
                  <span>{user.website}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <FiCalendar size={16} />
                <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-4">
              <div>
                <span className="font-bold text-gray-900">{user.postsCount || 0}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">{user.followersCount || 0}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">{user.followingCount || 0}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
      </div>

      {postsLoading ? (
        <div className="flex justify-center py-8">
          <Loading text="Loading posts..." />
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
