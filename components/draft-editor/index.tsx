"use client";
import React, { FC, useCallback } from "react";
import dynamic from "next/dynamic";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { cn } from "@/lib/utils";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false } // Optionally add a loading state
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface PropsType {
  placeholder: string;
  wrapperClassName?: string;
  editorClassName?: string;
  onChange: (html: string) => void;
  editorState?: EditorState; // Receive the editor state
  setEditorState?: (state: EditorState) => void;
}

export const DraftEditor: FC<PropsType> = ({
  placeholder,
  editorClassName,
  wrapperClassName,
  onChange,
  editorState,
  setEditorState,
}) => {
  const onEditorStateChange = useCallback(
    (state: EditorState) => {
      setEditorState?.(state);
      const contentState = state.getCurrentContent();
      console.log(contentState, "contentState");
      const convertRaw = convertToRaw(contentState);
      const html = draftToHtml(convertRaw);
      onChange(html);
    },
    [onChange]
  );

  return (
    <Editor
      toolbarHidden
      editorState={editorState || EditorState.createEmpty()}
      onEditorStateChange={onEditorStateChange}
      placeholder={placeholder}
      wrapperClassName={cn(
        "wrapper-class border border-input",
        wrapperClassName
      )}
      editorClassName={cn("editor-class", editorClassName)}
    />
  );
};
