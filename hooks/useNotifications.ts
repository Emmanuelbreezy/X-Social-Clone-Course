import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useNotifications = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/api/notifications`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useNotifications;
