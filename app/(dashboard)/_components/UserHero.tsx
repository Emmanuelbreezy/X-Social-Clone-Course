import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { UserType } from "@/types/user.type";

interface PropsType {
  user: UserType;
}
const UserHero: React.FC<PropsType> = ({ user }) => {
  const { coverImage, username, profileImage, image, name } = user;
  const avatarImg = profileImage ? profileImage : image;
  return (
    <div>
      <div className="bg-neutral-700 h-44 relative">
        {coverImage && (
          <div className="w-full h-44 relative">
            <Image
              src={coverImage}
              fill
              alt="cover image"
              className="w-full h-full object-contain object-center"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        <div className="absolute -bottom-16 left-4">
          <div className="bg-neutral-800 !w-[141px] !h-[141px] rounded-full p-[2px] border-2 border-inherit">
            <Avatar className="transition cursor-pointer !w-full h-full hover:opacity-90">
              <AvatarImage
                src={avatarImg || ""}
                alt={username || ""}
                className="object-cover"
              />
              <AvatarFallback className="font-bold text-[60px]">
                {name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHero;
