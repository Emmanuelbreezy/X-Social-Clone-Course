"use client";
import React, { createContext, useContext } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { BASE_URL } from "@/lib/base-url";
import { UserType } from "@/types/user.type";

type CurrentUserType = {
  currentUser: UserType;
};
// Define the context shape
type CurrentUserContextType = {
  data?: CurrentUserType;
  error: any;
  isLoading: boolean;
  mutate: () => void;
};

// Create the context with default values
const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading, mutate } = useSWR<CurrentUserType>(
    `${BASE_URL}/api/current-user`,
    fetcher
  );

  // Provide user data and other SWR states (loading, error, mutate) to the context
  return (
    <CurrentUserContext.Provider value={{ data, error, isLoading, mutate }}>
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
