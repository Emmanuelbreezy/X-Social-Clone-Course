import { BASE_URL } from "@/lib/base-url";
import fetcher from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

interface PropsType {
  query: string;
  filter?: string;
}

const useSearch = ({ query, filter }: PropsType) => {
  const enabled = !!query; // Enable query only if a search query exists

  // Construct URL based on the query and filter
  const url = query ? `${BASE_URL}/api/search?q=${query}&f=${filter}` : null;

  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["search", query, filter], // Create a unique query key based on query and filter
    queryFn: () => fetcher(url!), // Use the fetcher function to fetch data
    enabled, // Only run the query if enabled
  });

  const loading = isLoading || isFetching;

  return {
    data,
    error,
    isLoading: loading,
    refetch, // Function to manually trigger a refetch
  };
};

export default useSearch;
