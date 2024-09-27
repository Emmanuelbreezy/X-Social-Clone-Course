"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "../spinner";

const SubscriptionButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${BASE_URL}/api/stripe`);
      if (response.data.url && typeof window !== "undefined") {
        // Redirect the user to the Stripe checkout session
        window.location.href = response.data.url;
      } else {
        throw new Error("Stripe session URL not found");
      }
    } catch (err) {
      console.log(err, "STRIPE_VLIENT_ERROR");
      toast({
        title: "ERROR",
        description:
          "Error occurred while processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      className="shadow gap-1"
      onClick={handleClick}
    >
      <>
        <Lock size="17px" />
        Manage Subscription
      </>
      {loading && <Spinner size="default" />}
    </Button>
  );
};

export default SubscriptionButton;
