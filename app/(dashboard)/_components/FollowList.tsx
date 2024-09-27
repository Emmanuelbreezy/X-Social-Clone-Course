"use client";
import React from "react";
import Link from "next/link";
import { Spinner } from "@/components/spinner";
import useUsers from "@/hooks/useUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/badge";
import { UserType } from "@/types/user.type";
import FollowButton from "./_common/FollowButton";
import { PLAN_TYPE } from "@/constants/pricing-plans";

const FollowList = () => {
  const { data, isLoading } = useUsers();
  const users: UserType[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="bg-background dark:border dark:border-[rgb(47,51,54)] rounded-xl p-4">
        <div className="flex items-center justify-center">
          <Spinner size="icon" />
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }
  return (
    <div className="bg-background border dark:border-[rgb(47,51,54)] rounded-xl p-4">
      <div className="w-full">
        <h2 className="text-[20px] font-bold">Who to follow</h2>
      </div>
      <div>
        <ul role="list" className="flex flex-col gap-6 mt-4 pb-2">
          {users?.map((user) => (
            <li
              role="listitem"
              tabIndex={0}
              key={user.id}
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
                      {user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
                    </div>
                  </Link>
                  <div className="w-full block max-w-[100%]">
                    <Link
                      role="link"
                      href={`/${user.username}`}
                      className="w-fit"
                    >
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FollowList;
