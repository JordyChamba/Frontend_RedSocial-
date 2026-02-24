import { useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '@/services/postService';
import CreatePost from '@/components/post/CreatePost';
import PostCard from '@/components/post/PostCard';
import Loading from '@/components/auth/Loading';
import Button from '@/components/auth/Button';

export default function HomePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 0 }) => postService.getFeedPosts(pageParam, 10),
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.pageable.pageNumber + 1;
    },
    initialPageParam: 0,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Loading your feed..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Failed to load feed</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.content) || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      <CreatePost />

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No posts yet in your feed.</p>
            <p className="text-sm text-gray-400">
              Follow some users to see their posts here!
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

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
                <p className="text-gray-500 text-sm">You've reached the end!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
