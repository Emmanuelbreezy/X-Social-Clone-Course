"use client";
import React from "react";
import { usePathname } from "next/navigation";
import FollowList from "./FollowList";
import SubscribeAds from "./_common/Subscribeads";
import SearchForm from "./SearchForm";

const Rightbar = (props: { isPro: boolean }) => {
  const pathname = usePathname();
  return (
    <aside className="px-0 fixed top-0 py-4 hidden lg:flex min-w-[330px]">
      <div className="w-full flex flex-col gap-3 max-w-[330px]">
        {/* {Search bar} */}
        {pathname !== "/search" && <SearchForm />}
        {!props.isPro && <SubscribeAds />}
        <FollowList />
      </div>
    </aside>
  );
};

export default Rightbar;
