// components/UpgradeCard.js
"use client";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { useStore } from "@/hooks/useStore";

const UpgradeCard = () => {
  const openProModal = useStore((state) => state.openProModal);

  return (
    <Card
      role="button"
      onClick={openProModal}
      className="border-dashed bg-cream border-gray-400 w-full max-w-[350px] cursor-pointer h-[220px] flex justify-center items-center"
    >
      <CardContent className="flex gap-2 items-center">
        <div className="rounded-full border-2 p-1">
          <Plus className="text-gray-400" />
        </div>
        <CardDescription className="font-semibold">
          Upgrade Plan
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
