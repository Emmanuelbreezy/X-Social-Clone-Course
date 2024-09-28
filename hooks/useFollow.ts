"use client";
import { followUser } from "@/app/actions/follow.action";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { UserType } from "@/types/user.type";
import { toast } from "./use-toast";

const useFollow = (userId: number, username: string) => {
  const { data } = useCurrentUserContext();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  // Memoize currentUser data
  const currentUser = useMemo(() => {
    return data?.currentUser || ({} as UserType);
  }, [data]);

  // Memoize the isFollowing value
  const isFollowing = useMemo(() => {
    const following = currentUser.followingIds || [];
    return following.includes(userId);
  }, [currentUser.followingIds, userId]);

  const toggleFollow = useCallback(async () => {
    try {
      setLoading(true);
      const response = await followUser(userId);
      // Invalidate all posts query (for homepage)
      if (username) {
        queryClient.invalidateQueries({
          queryKey: ["user", username],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      toast({
        title: "Success",
        description: response.isFollowing
          ? "Followed user successfully"
          : "Unfollowed user successfully",
        variant: "default",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to follow",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [queryClient, userId, username]);

  return {
    loading,
    isFollowing,
    toggleFollow,
  };
};

export default useFollow;
