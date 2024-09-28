"use client";
import BirthDayModal from "@/components/birthday-modal";
import ProModal from "@/components/Pro-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ProModal />
      <BirthDayModal />
    </>
  );
};
