import { useCallback, useState } from "react";
import { uploadFileAction } from "@/app/actions/upload.action";
import { toast } from "./use-toast";

// Helper function to convert file to base64 for preview
const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const useUploadcare = () => {
  const [progress, setProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setProgress(0);

      // Convert the file to base64 for preview
      const base64String = await toBase64(file);
      setBase64(base64String as string);

      // Call the server action to upload the file to Uploadcare
      const UPLOADCARE_PUBLIC_KEY =
        process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

      const formData = new FormData();
      formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY as string);
      formData.append("UPLOADCARE_STORE", "1");
      formData.append("file", file);

      const result = await uploadFileAction(formData);

      if (result.uploadedUrl) {
        setUploadedUrl(result.uploadedUrl); // Set the uploaded file URL
        setUploading(false);
        toast({
          title: "Sucess",
          description: "Upload successfully",
          variant: "default",
        });
        return result.uploadedUrl; // Return the uploaded URL from the function
      }

      setUploading(false);
      return null;
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Upload failed",
        variant: "destructive",
      });
      setUploading(false);
      return null;
    }
  }, []);

  const clearFile = useCallback(() => {
    setBase64("");
    setUploadedUrl("");
  }, []);

  return {
    uploadFile,
    progress,
    uploadedUrl,
    base64,
    uploading,
    clearFile,
  };
};

export default useUploadcare;
