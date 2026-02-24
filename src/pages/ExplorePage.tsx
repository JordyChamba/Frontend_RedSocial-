import { useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '@/services/postService';
import PostCard from '@/components/post/PostCard';
import SearchUsers from '@/components/user/SearchUsers';
import Loading from '@/components/auth/Loading';
import Button from '@/components/auth/Button';

export default function ExplorePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', 'all'],
    queryFn: ({ pageParam = 0 }) => postService.getAllPosts(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.pageable.pageNumber + 1;
    },
    initialPageParam: 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Exploring posts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Failed to load posts</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.content) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Explore</h1>
          <p className="text-gray-600 mt-1">Discover posts from everyone on SocialHub</p>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">No posts available yet.</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Load More Button */}
              {hasNextPage && (
                <div className="flex justify-center py-6">
                  <Button
                    onClick={() => fetchNextPage()}
                    isLoading={isFetchingNextPage}
                    variant="outline"
                  >
                    Load More Posts
                  </Button>
                </div>
              )}

              {!hasNextPage && posts.length > 0 && (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">You've seen it all!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <SearchUsers />
        </div>
      </div>
    </div>
  );
}
