/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "@/hooks/useDebounce"; // A debounce hook to prevent excessive API calls
import { checkUsername } from "@/app/actions/check-username.action";
import { generateBaseUsername } from "@/lib/helper";

const CheckUsername = ({ fullname }: { fullname: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { register, watch, setError, setValue, clearErrors } = useFormContext();
  const username = watch("username");

  const debouncedUsername = useDebounce(username, 500); // Debouncing to avoid too many requests

  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername);
    }
  }, [debouncedUsername]);

  const checkUsernameAvailability = async (username: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/check-username?username=${username}`);
      const data = await res.json();
      setIsAvailable(data.isAvailable);
      setSuggestions([]);
      clearErrors("username");

      if (!data.isAvailable) {
        // Generate 4 alternative usernames based on fullName
        const generatedSuggestions = Array(4)
          .fill(null)
          .map(() => generateBaseUsername(username));
        setSuggestions(generatedSuggestions);

        setError("username", { message: "Username is already taken" });
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setError("username", { message: "Error checking username:" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue("username", suggestion);
    clearErrors("username");
  };

  return (
    <div className="w-full relative">
      <Input
        type="text"
        placeholder="Enter username"
        autoComplete="off"
        disabled={isLoading}
        className="form--input w-full focus:border-0 dark:border-[rgba(255,255,255,0.5)]"
        {...register("username")}
      />
      {/* Loader and validation icons */}
      <div className="absolute right-3 top-3">
        {isLoading ? (
          <Loader2 className="animate-spin text-gray-500" size={20} />
        ) : isAvailable === true ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : isAvailable === false ? (
          <XCircle className="text-red-500" size={20} />
        ) : null}
      </div>

      {/* Suggested usernames */}
      {isAvailable === false && suggestions.length > 0 && (
        <div className="mt-2 text-sm ">
          <p className="mb-1 ">Suggestions:</p>
          <ul className="flex flex-row gap-3 flex-wrap ml-[1px] text-base text-primary">
            {suggestions.map((suggestion) => (
              <li
                role="button"
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckUsername;
