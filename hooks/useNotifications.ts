import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

const useNotifications = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["notifications"], // Unique key for the notifications query
    queryFn: () => fetcher(`${BASE_URL}/api/notifications`), // Fetch notifications using the fetcher
  });

  return {
    data,
    error,
    isLoading,
    refetch, // Function to manually trigger a refetch
  };
};

export default useNotifications;
