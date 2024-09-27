"use client";
import React from "react";
import Modal from "@/components/modal";

const BirthDayModal = (props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose } = props;

  return (
    <Modal
      title="What's your birth date?"
      isOpen={isOpen}
      onClose={onClose}
      body={<div>user</div>}
    />
  );
};

export default BirthDayModal;
