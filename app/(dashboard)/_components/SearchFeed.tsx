"use client";

import Link from "next/link";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "./_common/FollowButton";
import useSearch from "@/hooks/useSearch";
import { Spinner } from "@/components/spinner";
import PostItem from "./_common/PostItem";
import { PostType } from "@/types/post.type";
import { UserType } from "@/types/user.type";
import Badge from "@/components/badge";
import { PLAN_TYPE } from "@/constants/pricing-plans";

const SearchFeed = () => {
  const router = useRouter();
  const param = useSearchParams();
  const query = param.get("q") ?? "";
  const filter = param.get("f") ?? "";

  const { data, isLoading } = useSearch({
    query,
    filter,
  });

  const posts = data?.posts || [];
  const users = data?.users || [];

  const handleQuery = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handlePeopleQuery = () => {
    router.push(`/search?q=${encodeURIComponent(query)}&f=user`);
  };

  console.log(data);

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="flex items-center justify-start gap-14  w-full px-5  h-auto pb-2 !bg-transparent border-b-[1px] dark:border-[rgb(47,51,54)]">
        <TabsTrigger
          value="posts"
          className="!text-base active:font-bold"
          onClick={handleQuery}
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="people"
          className="!text-base active:font-bold"
          onClick={handlePeopleQuery}
        >
          People
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="w-full">
        <div className="w-full flex flex-col items-center justify-center">
          {isLoading ? (
            <Spinner size="lg" />
          ) : posts?.length === 0 ? (
            <div className=" w-full p-6">
              <p className="text-xl text-center  dark:text-white/80">
                No post found
              </p>
            </div>
          ) : (
            <>
              {posts?.map((post: PostType) => (
                <PostItem key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
      </TabsContent>
      <TabsContent value="people" className=" px-5">
        <div className="flex items-center justify-center">
          {isLoading ? (
            <Spinner size="lg" />
          ) : users?.length === 0 ? (
            <div className=" w-full p-6">
              <p className="text-xl text-center dark:text-white/80">
                No user found
              </p>
            </div>
          ) : (
            <ul role="list" className="flex w-full flex-col gap-6 mt-4 pb-2">
              {users?.map((user: UserType) => (
                <li
                  key={user.id}
                  role="listitem"
                  tabIndex={0}
                  className="flex flex-row gap-4 cursor-pointer "
                >
                  <Link
                    role="link"
                    href={`/${user.username}`}
                    className="flex-shrink-0 w-fit"
                  >
                    <Avatar className="transition cursor-pointer hover:opacity-90">
                      <AvatarImage
                        src={user?.profileImage || user?.image || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="font-bold text-[18px]">
                        {user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="flex flex-1 flex-row items-center justify-between">
                      <div className="flex flex-col">
                        <Link
                          role="link"
                          href={`/${user.username}`}
                          className="hover:underline w-auto"
                        >
                          <div className="flex flex-row gap-1">
                            <h5 className="font-semibold text-[15.5px] transition">
                              {user.name}
                            </h5>

                            {user?.subscription?.plan === PLAN_TYPE.PRO && (
                              <Badge />
                            )}
                          </div>
                        </Link>
                        <div className="w-full block max-w-[100%]">
                          <Link role="link" href={`/`} className="w-fit">
                            <p className="!text-[#959fa8] text-sm block truncate font-medium">
                              @{user.username || "no username"}
                            </p>
                          </Link>
                        </div>
                      </div>
                      <div className="flex-shrink">
                        <FollowButton
                          userId={user?.id}
                          username={user?.username as string}
                        />
                      </div>
                    </div>
                    <div className="pt-3">
                      <p className="text-[15px] font-normal">{user?.bio}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SearchFeed;
