import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useUser = (username: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    username ? `${BASE_URL}/api/users/${username}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useUser;
