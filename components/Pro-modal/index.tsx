"use client";
import React, { useState } from "react";
import axios from "axios";
import { useStore } from "@/hooks/useStore";
import { Check } from "lucide-react";
import { BASE_URL } from "@/lib/base-url";
import { Spinner } from "../spinner";
import { Button } from "../ui/button";
import Modal from "../modal";
import { DURATION_TYPE, PRO_PLAN } from "@/constants/pricing-plans";

const ProModal = () => {
  const { isProModalOpen, closeProModal } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubscribe = async () => {
    try {
      setLoading(true); // Start loading
      setError(""); // Clear previous errors
      const response = await axios.get(`${BASE_URL}/api/stripe`);
      console.log(response, "response:");

      if (response.data.url && typeof window !== "undefined") {
        // Redirect the user to the Stripe checkout session
        window.location.href = response.data.url;
      } else {
        throw new Error("Stripe session URL not found");
      }
    } catch (err) {
      console.log(err, "STRIPE_VLIENT_ERROR");
      setError(
        "An error occurred while processing your subscription. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  console.log(error, "STRIPE_");

  return (
    <Modal
      title="Upgrade to Premium"
      subTitle="Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security."
      isCentered
      isOpen={isProModalOpen}
      onClose={closeProModal}
      body={
        <div className="w-full">
          <div className="flex flex-col gap-4  border-primary border-[#282829] shrink-0 max-w-[300px] mx-auto min-h-[328px] px-[30px] py-[25px] border rounded-2xl relative ">
            <div className="w-full">
              <h1 className="text-2xl font-semibold">{PRO_PLAN.typeName}</h1>
            </div>
            <div className="flex items-center">
              <h5 className="text-5xl font-semibold">
                ${PRO_PLAN.price}
                <span className="!text-[16px]">
                  {PRO_PLAN.duration === DURATION_TYPE.MONTHLY && "/month"}
                </span>
              </h5>
            </div>
            <p className="">{PRO_PLAN.description}</p>
            <div>
              <p className="font-normal text-[14px] mb-1">
                {PRO_PLAN.highlightFeature}
              </p>
              <ul className="font-normal flex mb-3 flex-col gap-2">
                {PRO_PLAN.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex gap-2 items-center text-[15px]"
                  >
                    <Check size="20px" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                disabled={loading}
                variant="brandPrimary"
                size="brandsm"
                width="full"
                onClick={onSubscribe}
              >
                {loading && <Spinner size="default" />}
                Subscribe & Pay
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ProModal;
