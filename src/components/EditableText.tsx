import React, { useRef, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

import {
  copyPlainText,
  cutPlainText,
  setEndOfContenteditable,
  stripHtml,
} from "~/lib/dom";

import { ReactComponent as PencilAltIcon } from "~/assets/icons/pencil-alt-outline.svg";

export interface EditableTextProps {
  // provided text
  text?: string;

  // custom style provided
  className?: string;

  // placeholder text if no text is provided
  placeholder?: string;

  // class name for clamped lines
  clampClassName?: string;
  clampLines?: number;

  // whether to edit on element focus
  focusOnEdit?: boolean;

  // whether initially editing (false by default, except if not text is provided)
  editing?: boolean;

  // whether to start editing on text click (false by default)
  editOnClick?: boolean;

  // whether to show edit icon (true, except if editOnClick is true)
  showEditIcon?: boolean;

  // on change gets triggered when text content has changed
  onChange?: (text: string) => void;
}

export const EditableText: React.FC<EditableTextProps> = ({
  text,
  className = "",
  placeholder = "Write text here...",
  clampLines,
  clampClassName = clampLines ? `line-clamp-${clampLines.toString()}` : "",
  focusOnEdit = true,
  editOnClick = false,
  showEditIcon = !editOnClick,
  editing = !text,

  // event handlers
  onChange = () => null,
}) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [isClamping, setIsClamping] = useState(
    !!(clampLines || clampClassName)
  );
  const editableDivRef = useRef<HTMLDivElement>(null);
  const textRef = useRef(text || "");
  const [previousText, setPreviousText] = useState(text || "");

  useEffect(() => {
    if (!text) return;
    textRef.current = text;
    setIsEditing(false);
  }, [text]);

  useEffect(() => setIsEditing(editing), [editing]);

  useEffect(() => {
    if (!isEditing || !focusOnEdit) return;

    setTimeout(() => {
      if (!editableDivRef.current) return;

      editableDivRef.current.focus();
      setEndOfContenteditable(editableDivRef.current);
    }, 0);
  }, [isEditing]);

  useEffect(() => {
    if (textRef.current === previousText) return;

    onChange(textRef.current);
    setPreviousText(textRef.current);
  }, [isEditing]);

  return (
    <>
      {isEditing ? (
        <ContentEditable
          className={`empty:before:content-[attr(placeholder)]
            empty:before:text-gray-400
            empty:focus:before:content-['']
            ${className}`}
          innerRef={editableDivRef}
          placeholder={placeholder}
          html={textRef.current}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setIsEditing(false);
            }
          }}
          onChange={(e) => {
            textRef.current = stripHtml(e.target.value).trimEnd();
          }}
          onCopy={copyPlainText}
          onCut={cutPlainText}
          onBlur={() => {
            if (textRef.current === "" && editableDivRef.current) {
              editableDivRef.current.innerHTML = "";
              return;
            }

            setIsEditing(false);
          }}
        />
      ) : (
        <div
          className={`${className} w-full ${isClamping ? clampClassName : ""}`}
          onClick={() => {
            setIsClamping(false);
            if (editOnClick) setIsEditing(true);
          }}
        >
          {textRef.current}
          {showEditIcon && (
            <PencilAltIcon
              className="ml-0.5 w-4 h-4 cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
            />
          )}
        </div>
      )}
    </>
  );
};
