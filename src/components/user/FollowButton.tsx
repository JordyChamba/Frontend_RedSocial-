import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { userService } from '@/services/userService';
import Button from '../auth/Button';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  username: string;
}

export default function FollowButton({ userId, isFollowing, username }: FollowButtonProps) {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () =>
      isFollowing ? userService.unfollowUser(userId) : userService.followUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', username] });

      const previousUser = queryClient.getQueryData(['user', username]);

      queryClient.setQueryData(['user', username], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !isFollowing,
          followersCount: isFollowing ? old.followersCount - 1 : old.followersCount + 1,
        };
      });

      return { previousUser };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', username], context.previousUser);
      }
      toast.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'} user`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', username] });
      toast.success(isFollowing ? 'Unfollowed!' : 'Following!');
    },
  });

  return (
    <Button
      onClick={() => followMutation.mutate()}
      variant={isFollowing ? 'secondary' : 'primary'}
      size="md"
      isLoading={followMutation.isPending}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
