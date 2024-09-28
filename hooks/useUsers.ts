import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";

const useUsers = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["users", "allusers"], // Unique query key for the users
    queryFn: () => fetcher(`${BASE_URL}/api/users`), // Fetch the users
  });

  return {
    data,
    error,
    isLoading,
    refetch, // Refetch function
  };
};

export default useUsers;
