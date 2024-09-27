"use client";
import React from "react";
import { Spinner } from "@/components/spinner";
import usePosts from "@/hooks/usePosts";
import { useParams } from "next/navigation";
import Header from "../../../../_components/_common/Header";
import PostItem from "../../../../_components/_common/PostItem";
import PostForm from "../../../../_components/_common/PostForm";
import { PostType } from "@/types/post.type";
import CommentFeed from "../../../../_components/CommentFeed";

const PostView = () => {
  const param = useParams();
  const postId = param?.postId as string;
  const { data, isLoading } = usePosts({ postId: +postId });
  const post: PostType = data?.post ?? {};

  if (isLoading) {
    return (
      <div className="flex flex-col h-[25vh] items-center w-full justify-center">
        <Spinner size="icon" />
      </div>
    );
  }
  return (
    <>
      <Header label="Post" showBackArrow />
      <PostItem post={post} />
      <PostForm
        placeholder="Post your reply"
        postId={post.id}
        postUsername={post?.user?.username}
        isComment
      />
      <CommentFeed comments={post?.comments} />
    </>
  );
};

export default PostView;
