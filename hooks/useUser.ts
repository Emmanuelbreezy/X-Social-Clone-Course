import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";

const useUser = (username: string) => {
  // Construct the URL based on the username
  const url = username ? `${BASE_URL}/api/users/${username}` : null;

  // Use useQuery to fetch the user data
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["user", username], // Unique query key for the user
    queryFn: () =>
      url ? fetcher(url) : Promise.reject("No username provided"),
    enabled: !!url, // Only run the query if the URL is valid
  });

  return {
    data,
    error,
    isLoading,
    refetch, // Refetch function, similar to mutate
  };
};

export default useUser;
