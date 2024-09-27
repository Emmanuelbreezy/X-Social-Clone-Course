import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/api/users`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useUsers;
