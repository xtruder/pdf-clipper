import React, { useState } from "react";

import { ReactComponent as InformationCircleIcon } from "../assets/icons/information-circle-outline.svg";
import { ReactComponent as ExclamationCircleIcon } from "../assets/icons/exclamation-circle-outline.svg";
import { ReactComponent as DocumentOutlineIcon } from "../assets/icons/document-outline.svg";

import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { TopbarProgressIndicator } from "./ProgressIndicator";

export interface DocumentDropZoneProps {
  className?: string;
  progress?: number;

  disabled?: boolean;
  maxSizeInMB?: number;
  accept: Accept;

  /** indicates to display error during document dropping */
  error?: boolean | Error;
  success?: boolean;

  // events
  onFile?: (file: File) => void;
  onFileRejected?: (fileRejection: FileRejection) => void;
}

export const DocumentDropZone: React.FC<DocumentDropZoneProps> = ({
  className,
  progress,

  disabled,
  maxSizeInMB = 100,
  accept,

  error = false,
  success = false,

  onFile,
  onFileRejected,
}) => {
  const [lastFile, setLastFile] = useState<File>();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: (files) => {
      const file = files[0]!;

      setLastFile(file);
      onFile?.(file);
    },
    onDropRejected: (fileRejections) => {
      const rejectedFile = fileRejections[0]!;

      onFileRejected?.(rejectedFile);
    },
    multiple: false,
    maxSize: maxSizeInMB * 1000000,
    disabled: disabled || !!progress,
    accept,
  });

  const Icon = error
    ? ExclamationCircleIcon
    : lastFile
    ? DocumentOutlineIcon
    : InformationCircleIcon;

  const contentEl = isDragActive ? (
    <>Drop your document here ...</>
  ) : error ? (
    <>Upload error: {error instanceof Error ? error.message : lastFile?.name}</>
  ) : lastFile && success ? (
    <>Upload success: {lastFile.name}</>
  ) : lastFile && progress ? (
    lastFile.name
  ) : (
    <>Drag 'n' drop documents here, or click to select file</>
  );

  const errorCls = error && "border-error text-error";
  const successCls = success && !error && "border-success text-success";

  return (
    <div
      {...getRootProps()}
      className={`flex bg-base-200 rounded-lg p-2 p-2 ${className}`}
    >
      <input {...getInputProps()} />

      <div
        className={`flex justify-center items-center text-center h-full w-full bg-base-100 p-1 border-1 border-dashed ${errorCls} ${successCls}`}
      >
        <div className="flex flex-col w-full p-1">
          <div
            className={`flex flex-row alert w-full mt-1 ${
              !progress ? "mb-1" : ""
            }`}
          >
            <Icon
              className={`w-8 h-8 stroke-current mr-2 ${errorCls} ${successCls}`}
            />

            <span className="flex-1 w-full text-justify">{contentEl}</span>
          </div>
          {!!progress && (
            <TopbarProgressIndicator showPct={false} progress={progress} />
          )}
        </div>
      </div>
    </div>
  );
};
