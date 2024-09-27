"use client";
import React, { Fragment } from "react";
import { useParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import { Spinner } from "@/components/spinner";
import Header from "../../_components/_common/Header";
import UserHero from "../../_components/UserHero";
import UserBio from "../../_components/UserBio";
import Logo from "@/components/logo";
import { UserType } from "@/types/user.type";
import PostFeed from "../../_components/PostFeed";

const SingleUser = () => {
  const param = useParams();
  const username = param?.username as string;
  const { data, isLoading } = useUser(username);
  const fetchedUser: UserType = data?.data;

  if (isLoading || !data) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Logo width="50px" height="50px" className="animate-pulse" />
        <Spinner size="icon" />
      </div>
    );
  }

  return (
    <Fragment>
      <Header label={fetchedUser?.name || ""} showBackArrow />
      <UserHero user={fetchedUser} />
      <UserBio user={fetchedUser} />
      <PostFeed userId={fetchedUser?.id} />
    </Fragment>
  );
};

export default SingleUser;
