import { FC, useState } from "react";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import useFollow from "@/hooks/useFollow";
import { cn } from "@/lib/utils";

interface PropsType {
  userId: number;
  username: string;
}

const FollowButton: FC<PropsType> = ({ userId, username }) => {
  const { isFollowing, toggleFollow, loading } = useFollow(userId, username);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      type="button"
      variant={isFollowing ? "outline" : "brandSecondary"}
      title={isFollowing ? "Unfollow" : "Follow"}
      disabled={loading}
      onClick={toggleFollow}
      className={cn("!font-semibold  gap-1", {
        "hover:!border-red-500 text-sm hover:bg-red-500/10": isFollowing,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading && <Spinner />}
      {isHovered && isFollowing
        ? "Unfollow"
        : isFollowing
        ? "Following"
        : "Follow"}
    </Button>
  );
};

export default FollowButton;
