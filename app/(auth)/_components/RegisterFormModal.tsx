"use client";
import React, { useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/base-url";
import CheckUsername from "@/components/check-username";

const RegisterFormModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address." }),
    username: z.string().trim().min(1, { message: "Username is required" }),
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid date",
      }),
    password: z.string().trim().min(1, { message: "Password is required." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      dateOfBirth: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/register`, {
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
        dateOfBirth: values.dateOfBirth,
      });
      form.reset();
      toast({
        title: "Sucess",
        description: "Registered successfully",
        variant: "default",
      });
      handleClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to register",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="Create your account"
      isOpen={isOpen}
      onClose={handleClose}
      body={
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full w-full flex-col items-center justify-center space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      disabled={false}
                      className="form--input w-full focus:border-0 dark:border-[rgba(255,255,255,0.5)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      disabled={false}
                      className="form--input w-full focus:border-0 dark:border-[rgba(255,255,255,0.5)]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <CheckUsername />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        disabled={false}
                        placeholder="Enter password"
                        className="form--input  
                    dark:border-[rgba(255,255,255,0.5)] focus:border-0 focus:ring-primary
                    "
                        {...field}
                      />
                    </div>
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
              disabled={isLoading}
            >
              {isLoading && <Spinner size="default" />}
              Create
            </Button>
          </form>
        </FormProvider>
      }
    >
      <Button
        variant="brandOutline"
        width="full"
        size="brandsm"
        className="!mt-5 gap-1"
        onClick={() => setIsOpen(true)}
      >
        Create account
      </Button>
    </Modal>
  );
};

export default RegisterFormModal;
