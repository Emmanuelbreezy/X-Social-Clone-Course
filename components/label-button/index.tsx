import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PropsType {
  label: string;
  fullWidth?: boolean;
  large?: boolean;
  outline?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  onClick?: () => void;
}

const LabelButton: React.FC<PropsType> = ({
  secondary,
  fullWidth,
  label,
  large,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        `disabled:opacity-70 diabled:cursor-not-allowed font-semibold hover:opacity-80 
          transition border-2 w-fit bg-primary text-white text-md border-primary`,
        {
          "border-black text-black bg-white": secondary,
          "w-full": fullWidth,
          "text-xl": large,
        }
      )}
    >
      {label}
    </Button>
  );
};

export default LabelButton;
