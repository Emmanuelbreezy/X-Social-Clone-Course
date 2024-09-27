import { Button } from "@/components/ui/button";
import { Feather } from "lucide-react";
import React from "react";

const SidebarTweetButton = () => {
  return (
    <div role="button">
      <Button
        variant="brandPrimary"
        size="icon"
        className="mt-6 lg:hidden rounded-full ml-1
      h-14 w-14 p-4 flex items-center justify-center
      hover:bg-opacity-80
      transition
      cursor-pointer
      "
      >
        <Feather size={24} color="white" />
      </Button>

      <Button
        variant="brandPrimary"
        className="w-full hidden lg:block !px-4 !py-2
       !h-auto
       !text-white
       cursor-pointer
       transition
       font-semibold
       text-[20px]
       "
      >
        Post
      </Button>
    </div>
  );
};

export default SidebarTweetButton;
