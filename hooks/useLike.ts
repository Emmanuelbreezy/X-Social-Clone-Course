"use client";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { likePost } from "@/app/actions/like.action";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { toast } from "./use-toast";

const useLike = (postId: number, likedIds: number[], userId?: number) => {
  const { data } = useCurrentUserContext();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  const hasLiked = useMemo(() => {
    const likes = likedIds || [];
    return likes.includes(data?.currentUser?.id as number);
  }, [likedIds, data?.currentUser?.id]);

  const toggleLike = useCallback(async () => {
    try {
      setLoading(true);
      const response = await likePost(postId);

      // Invalidate queries after the like/unlike action
      if (postId) {
        console.log(postId, "postId");
        // Invalidate the specific post query
        queryClient.invalidateQueries({
          queryKey: ["post", postId?.toString()],
        });
      }

      if (postId) {
        // Invalidate all posts query (for homepage)
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
      }

      // Optionally, invalidate user posts if you're viewing a user's posts
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["posts", "user", userId],
        });
      }

      toast({
        title: "Sucess",
        description: `${
          response.isLiked ? "Liked" : "UnLike"
        } post successfully`,
        variant: "default",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to like post",
        variant: "destructive",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [postId, queryClient, userId]);

  return {
    loading,
    hasLiked,
    toggleLike,
  };
};

export default useLike;
