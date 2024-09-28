/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/lib/fetcher";
import { BASE_URL } from "@/lib/base-url";
import { UserType } from "@/types/user.type";
import { useStore } from "@/hooks/useStore";

type CurrentUserType = {
  currentUser: UserType;
};
// Define the context shape
type CurrentUserContextType = {
  data?: CurrentUserType;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

// Create the context with default values
const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading, isFetching, refetch } =
    useQuery<CurrentUserType>({
      queryKey: ["currentUser"], // Unique key for the current user query
      queryFn: () => fetcher(`${BASE_URL}/api/current-user`), // Fetch current user data
    });

  const { openBirthDateModal } = useStore();

  // Check for birthday when the user data is loaded
  useEffect(() => {
    if (data?.currentUser && !data.currentUser.dateOfBirth) {
      openBirthDateModal(); // Open the modal if birthday is not present
    }
  }, [data, openBirthDateModal]);

  return (
    <CurrentUserContext.Provider
      value={{ data, error, isLoading, isFetching, refetch }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

// Custom hook to use the CurrentUserContext
export const useCurrentUserContext = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      "useCurrentUserContext must be used within a CurrentUserProvider"
    );
  }
  return context;
};
