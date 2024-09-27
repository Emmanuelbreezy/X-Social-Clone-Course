import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

interface PropsType {
  userId?: number;
  postId?: number;
}
const usePosts = (props: PropsType) => {
  const userId = props?.userId;
  const postId = props?.postId;
  const { data, error, isLoading, mutate } = useSWR(
    userId
      ? `${BASE_URL}/api/posts?userId=${userId}`
      : postId
      ? `${BASE_URL}/api/posts/${postId}`
      : `${BASE_URL}/api/posts`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default usePosts;
