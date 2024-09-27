"use client";
import React, { FC, useCallback } from "react";
import dynamic from "next/dynamic";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { cn } from "@/lib/utils";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

interface PropsType {
  placeholder: string;
  wrapperClassName?: string;
  editorClassName?: string;
  onChange: (html: string) => void;
  editorState: EditorState; // Receive the editor state
  setEditorState: (state: EditorState) => void;
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
      setEditorState(state);
      const contentState = state.getCurrentContent();
      const convertRaw = convertToRaw(contentState);
      console.log(contentState, "contentState");
      const html = draftToHtml(convertRaw);
      onChange(html);
    },
    [onChange]
  );

  return (
    <Editor
      toolbarHidden
      editorState={editorState}
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
