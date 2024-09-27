"use client";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { BASE_URL } from "@/lib/base-url";

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${BASE_URL}/api/current-user`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
