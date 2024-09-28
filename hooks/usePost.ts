import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";

interface PropsType {
  userId?: number;
  postId?: number;
}

const usePosts = ({ userId, postId }: PropsType) => {
  // Construct URL based on the presence of userId or postId
  const url = userId
    ? `${BASE_URL}/api/posts?userId=${userId}`
    : postId
    ? `${BASE_URL}/api/posts/${postId}`
    : `${BASE_URL}/api/posts`;

  // Create a unique queryKey based on userId and postId
  const queryKey = postId
    ? ["post", postId?.toString()] // Single post
    : userId
    ? ["posts", "user", userId] // Posts by a specific user
    : ["posts"]; // All posts

  const { error, data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => fetcher(url),
    enabled: !!url, // Only run query if the URL is valid
  });

  return {
    data,
    error,
    isLoading,
    isError,
    refetch, // Equivalent to mutate
  };
};

export default usePosts;
