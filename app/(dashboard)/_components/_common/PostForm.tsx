"use client";
import React, { FC, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { UserType } from "@/types/user.type";
import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/base-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DraftEditor } from "@/components/draft-editor";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import useUploadcare from "@/hooks/useUploadcare";
import { postComment } from "@/app/actions/coment.action";
import UploadButton from "@/components/upload-button";
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { EditorState } from "draft-js";

interface PropsType {
  placeholder: string;
  isComment?: boolean;
  postUsername?: string;
  postId?: number;
}
const PostForm: FC<PropsType> = ({
  placeholder,
  isComment,
  postId,
  postUsername,
}) => {
  const { base64, uploadFile, uploadedUrl, uploading, clearFile } =
    useUploadcare();
  const { data, isLoading } = useCurrentUserContext();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const currentUser = useMemo(() => {
    return data?.currentUser ?? ({} as UserType);
  }, [data]);

  const { username, name, profileImage }: UserType = currentUser;

  const formSchema = z.object({
    body: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        setLoading(true);

        if (isComment && postId) {
          await postComment({
            body: values.body,
            postId: postId,
            commentImage: uploadedUrl || "",
          });
          toast({
            title: "Success",
            description: "Comment created successfully",
            variant: "default",
          });
        } else {
          await axios.post(`${BASE_URL}/api/posts`, {
            body: values.body,
            postImage: uploadedUrl || "",
          });
          toast({
            title: "Success",
            description: "Post created successfully",
            variant: "default",
          });
        }
        setEditorState(EditorState.createEmpty());
        form.reset();
        clearFile();

        if (postId) {
          // Invalidate the specific post query
          queryClient.invalidateQueries({
            queryKey: ["post", postId?.toString()],
          });
        } else {
          // Invalidate all posts query (for homepage)
          queryClient.invalidateQueries({
            queryKey: ["posts"],
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create post or comment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [clearFile, form, isComment, postId, queryClient, uploadedUrl]
  );

  const handleUploadFile = useCallback(
    async (file: File) => {
      if (!file) return;
      await uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div className="border-b-[1px] dark:border-[rgb(47,51,54)] py-2">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col items-center justify-center px-3"
        >
          {isLoading ? (
            <Spinner size="lg" />
          ) : (
            <div className="w-full px-4 flex flex-row pb-1 gap-4">
              <div className="shrink-0">
                <Avatar>
                  <AvatarImage
                    src={profileImage || ""}
                    alt={username || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="font-bold">
                    {name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {isComment && (
                  <div className="flex items-center">
                    <p className="!text-[#959fa8] text-sm font-normal">
                      Replying to{" "}
                      <Link className="!text-primary" href={`/${postUsername}`}>
                        @{postUsername}
                      </Link>
                    </p>
                  </div>
                )}
                <div className="min-h-6 peer !max-h-80 overflow-auto overflow-x-hidden mb-3">
                  <DraftEditor
                    placeholder={placeholder || ""}
                    wrapperClassName="!min-h-6 !max-h-80 !border-none w-full"
                    editorClassName="placeholder:text-muted-foreground peer outline-0 px-0 focus-visible:outline-none text-[18px] resize-none !py-0 w-full focus:border-0 !border-none "
                    editorState={editorState}
                    setEditorState={setEditorState}
                    onChange={(html) => {
                      form.setValue("body", html);
                    }}
                  />
                </div>
                <div className="flex items-center">
                  {base64 && (
                    <div className="w-14 h-14 relative rounded-md border overflow-hidden">
                      <Image
                        src={base64 || ""}
                        width={44}
                        height={44}
                        alt=""
                        className="w-full h-full rounded-md object-cover"
                      />
                      {uploading && (
                        <div className="absolute inset-0 w-full h-full bg-gray-950/30 flex items-center justify-center">
                          <Spinner size="lg" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <hr
                  className="px-3  h-[0px] w-full opacity-0
               dark:border-[rgb(34,37,40)] mb-1 transition
              "
                />
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <UploadButton
                      disabled={uploading}
                      onFileSelect={handleUploadFile}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="brandPrimary"
                    size="brandsm"
                    disabled={loading || uploading || !form?.getValues()?.body}
                    className="
                        !h-auto
                        !text-white
                        cursor-pointer
                        font-semibold
                        text-base"
                  >
                    {loading ? (
                      <Spinner size="default" />
                    ) : isComment ? (
                      "Reply"
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

PostForm.displayName = "PostForm";
export default PostForm;
