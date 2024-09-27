/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { doCredentialLogin } from "../../actions/auth.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

const LoginForm = () => {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await doCredentialLogin({
        email: values.email,
        password: values.password,
      });

      toast({
        title: "Sucess",
        description: "login successfully",
        variant: "default",
      });

      // if (!!response.error) {
      //   console.error(response.error);
      //   toast({
      //     title: "Error",
      //     description: response.error.message,
      //     variant: "destructive",
      //   });
      // } else {
      //   toast({
      //     title: "Sucess",
      //     description: "login successfully",
      //     variant: "default",
      //   });
      // }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center justify-center space-y-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Email"
                  disabled={isLoading}
                  className="form--input focus:border-0 dark:border-[rgba(255,255,255,0.5)]"
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
              <FormControl>
                <div className="relative">
                  <Input
                    type="password"
                    disabled={isLoading}
                    placeholder="Password"
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
          type="submit"
          className="!mt-5 gap-1"
          disabled={isLoading}
        >
          {isLoading && <Spinner size="default" />}
          Sign In
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
