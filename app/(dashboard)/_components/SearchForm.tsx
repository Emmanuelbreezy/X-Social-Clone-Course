"use client";
import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const SearchForm = () => {
  const param = useSearchParams();
  const query = param.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(query);
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="w-full">
      <form
        className="w-full flex-1"
        action="#"
        role="search"
        onSubmit={handleSubmit}
      >
        <div className="relative flex flex-row items-center h-11 bg-[#eee] dark:bg-gray-800 rounded-full">
          <div className="shrink-0 w-8 flex items-center !justify-end text-muted-foreground">
            <SearchIcon size="20px" />
          </div>
          <div className="flex-1">
            <Input
              className="rounded-full w-full h-full border-0 !outline-none !ring-0"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
