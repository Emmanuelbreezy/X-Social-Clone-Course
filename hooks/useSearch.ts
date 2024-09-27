import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

interface PropsType {
  query: string;
  filter?: string;
}
const useSearch = (props: PropsType) => {
  const { query, filter } = props;
  const { data, error, isLoading, mutate } = useSWR(
    query ? `${BASE_URL}/api/search?q=${query}&f=${filter}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useSearch;
