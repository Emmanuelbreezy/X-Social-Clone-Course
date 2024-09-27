"use server";

import { auth } from "@/lib/auth";

export async function uploadFileAction(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Not signed in");
    }
    console.log(session, "session");

    const uploadUrl = "https://upload.uploadcare.com/base/";

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    const uploadedUrl = `https://ucarecdn.com/${data.file}/`;
    return { uploadedUrl };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload error" };
  }
}
