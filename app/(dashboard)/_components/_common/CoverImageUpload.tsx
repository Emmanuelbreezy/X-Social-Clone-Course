/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import React, { FC, useCallback, useState } from "react";
import Dropzone from "react-dropzone";

interface PropsType {
  value?: string;
  disabled?: boolean;
  onRemove?: () => void;
  onChange: (image: string) => void;
}

const CoverImageUpload: FC<PropsType> = ({ value, onChange, onRemove }) => {
  const [base64, setBase64] = useState(value);
  //const [file, setFile] = useState();

  const handleChange = useCallback(
    (image: string) => {
      onChange(image);
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (e: { stopPropagation: () => void }) => {
      console.log("remove");
      e.stopPropagation();
      setBase64("");
      onRemove?.();
    },
    [onRemove]
  );

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      setBase64(event.target.result);
      handleChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="cover--uploader">
      <Dropzone
        accept={{
          "image/png": [".png"],
          "image/jpg": [".jpg"],
          "image/jpeg": [".jpeg"],
        }}
        onDrop={(acceptedFiles) => {
          handleDrop(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              accept=".csv, .xls, .xlsx"
              {...getInputProps()}
            />
            <div className="w-full h-44 relative">
              {base64 && (
                <div className="w-full h-full overflow-hidden">
                  <Image
                    src={base64}
                    alt=""
                    fill
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              <div className="absolute inset-0 w-full h-full bg-gray-950/10 flex items-center justify-start">
                <div className="w-full flex justify-center gap-3 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full shadow w-10 h-10 p-2 bg-black/80 transition-colors hover:bg-opacity-60"
                  >
                    <Camera size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 p-2
                    shadow bg-black/80 transition-colors hover:bg-opacity-60"
                    onClick={handleRemove}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default CoverImageUpload;
