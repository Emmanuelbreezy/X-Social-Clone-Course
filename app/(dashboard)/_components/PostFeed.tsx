"use client";
import React from "react";
import usePosts from "@/hooks/usePost";
import PostItem from "./_common/PostItem";
import { PostType } from "@/types/post.type";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface PropsType {
  userId?: number;
  postId?: number;
}

const PostFeed: React.FC<PropsType> = ({ userId, postId }) => {
  const { data, isLoading, isError, refetch } = usePosts({ userId, postId });
  const posts = data?.posts ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col h-[25vh] items-center w-full justify-center">
        <Spinner size="icon" />
      </div>
    );
  }

  if (isError) {
    return (
      <Button variant="ghost" className="gap-2" onClick={() => refetch()}>
        <AlertTriangle />
        Retry
      </Button>
    );
  }
  return (
    <div>
      {posts?.map((post: PostType) => (
        <PostItem key={post.id} userId={userId} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
