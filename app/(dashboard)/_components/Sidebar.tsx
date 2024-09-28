"use client";
import Logo from "@/components/logo";
import React from "react";
import {
  AlertTriangle,
  Bell,
  Home,
  LucideIcon,
  Search,
  Settings,
  User,
} from "lucide-react";
//import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/spinner";
import { doLogout } from "@/app/actions/auth.action";
import { UserType } from "@/types/user.type";
import SidebarTweetButton from "./_common/SidebarTweetButton";
import SidebarItem from "./_common/SidebarItem";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { Button } from "@/components/ui/button";

interface MenuType {
  label: string;
  href?: string;
  icon?: LucideIcon;
  alert?: boolean;
}

const Sidebar = (props: { isPro: boolean }) => {
  const { isPro } = props;
  const router = useRouter();

  const { data, isLoading, refetch } = useCurrentUserContext();
  const fetchedUser: UserType = data?.currentUser ?? ({} as UserType);
  const username = fetchedUser?.username;

  const MENUS_LIST: MenuType[] = [
    {
      label: "Home",
      href: "/home",
      icon: Home,
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      alert: fetchedUser?.hasNotification || false,
    },
    ...(isPro
      ? []
      : [
          {
            label: "Premium",
            href: "#premium",
          },
        ]),
    {
      label: "Profile",
      href: `/${username}`,
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full fixed h-screen pr-0 lg:pr-6 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col h-full items-start">
        <div className="space-y-0 h-full pb-3 flex flex-col justify-between w-auto lg:w-[230px]">
          <div className="flex-1">
            <div className="my-2 pt-1 px-4">
              <Logo
                className="!h-8 !w-8 cursor-pointer"
                width="auto"
                height="auto"
                onClick={() => router.push("/home")}
              />
            </div>
            {MENUS_LIST.map((item) => {
              return (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  alert={item.alert}
                />
              );
            })}
            <div className="w-full pt-4">
              <SidebarTweetButton />
            </div>
          </div>
          <div className="flex-shrink-1">
            {isLoading ? (
              <Spinner size="lg" />
            ) : fetchedUser?.id ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="!outline-none">
                  <SidebarItem
                    isUser={true}
                    userInfo={{
                      username: fetchedUser?.username || "",
                      fullname: fetchedUser?.name || "",
                      profileImgUrl: fetchedUser?.profileImage || "",
                    }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-3 min-w-[260px] rounded-2xl max-w-[360px] min-h-[30px] mb-3">
                  <DropdownMenuItem asChild>
                    <form action={doLogout}>
                      <button
                        type="submit"
                        className="w-full flex flex-row items-center gap-2 
                      px-4 text-base !cursor-pointer
                      "
                      >
                        Log out{" "}
                        <span className="block max-w-[120px] truncate ml-1">
                          {fetchedUser?.name}
                        </span>
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="gap-2" onClick={refetch}>
                <AlertTriangle />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
