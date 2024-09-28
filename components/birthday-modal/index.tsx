"use client";
import React, { useCallback, useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Modal from "@/components/modal";
import { useStore } from "@/hooks/useStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../spinner";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { updateBirthday } from "@/app/actions/birthday.action";

const BirthDayModal = () => {
  const queryClient = useQueryClient();
  const { isBirthDateModalOpen, closeBirthDateModal } = useStore();
  const [isLoading, setLoading] = useState(false);

  const formSchema = z.object({
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid date",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setLoading(true);
        const response = await updateBirthday(values.dateOfBirth);
        form.reset();
        queryClient.invalidateQueries({
          queryKey: ["currentUser"],
        });
        toast({
          title: "Sucess",
          description: response?.message || "Updated birthday successfully",
          variant: "default",
        });

        closeBirthDateModal();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update birthday",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [queryClient, closeBirthDateModal]
  );

  return (
    <Modal
      title="What's your birth date?"
      isOpen={isBirthDateModalOpen}
      //onClose={closeBirthDateModal}
      body={
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-[200px] w-full flex-col items-start justify-between space-y-2"
          >
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Enter Dob"
                      disabled={false}
                      className="form--input w-full focus:border-0 dark:border-[rgba(255,255,255,0.5)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="brandPrimary"
              width="full"
              size="brandsm"
              className="!mt-5 gap-1"
              disabled={isLoading || !form?.getValues().dateOfBirth}
            >
              {isLoading && <Spinner size="default" />}
              Save
            </Button>
          </form>
        </FormProvider>
      }
    />
  );
};

export default BirthDayModal;
