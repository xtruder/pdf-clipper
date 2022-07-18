import React, { useCallback, useState } from "react";

import { ReactComponent as ExclamationCircleIcon } from "../assets/icons/exclamation-circle-outline.svg";

import { FileRejection, useDropzone } from "react-dropzone";
//import { TopbarProgressIndicator } from "./ProgressIndicator";

export interface DocumentDropZoneProps {
  onFile?: (file: File) => void;
  showProgress?: boolean;
  className?: string;
}

export const DocumentDropZone: React.FC<DocumentDropZoneProps> = ({
  onFile,
  //showProgress = false,
  className,
}) => {
  const [readerErrorStr, setReaderErrorStr] = useState<JSX.Element | null>(
    null
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const acceptedFile = acceptedFiles?.[0];
      const rejectedFile = fileRejections?.[0];

      if (!acceptedFile) {
        if (rejectedFile) {
          // append all error messages
          const msg = rejectedFile.errors.reduce<JSX.Element>(
            (val, e) => (
              <>
                {val}
                <br />
                {e.message}
              </>
            ),
            <></>
          );

          setReaderErrorStr(msg);
        }

        return;
      }

      onFile?.(acceptedFile);
      setReaderErrorStr(null);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // only one file for now
    maxSize: 100 * 1000000, // 100 MB for now, so we don't eat all memory
    accept: { "application/pdf": [] }, // accept only pdf for now
  });

  const Icon = readerErrorStr ? ExclamationCircleIcon : ExclamationCircleIcon;

  const text = readerErrorStr ? (
    <>{readerErrorStr}</>
  ) : isDragActive ? (
    <>Drop your document here ...</>
  ) : (
    <>Drag 'n' drop pdf document here, or click to select file</>
  );

  return (
    <div
      {...getRootProps()}
      className={`flex bg-base-200 rounded-lg p-2 p-2 ${className}`}
    >
      <input {...getInputProps()} />

      <div className="flex justify-center items-center text-center h-full w-full bg-base-100 border-1 border-dashed p-1">
        <div
          className={`alert ${
            readerErrorStr ? "alert-error" : ""
          } w-full min-h-20`}
        >
          <div className="flex justify-center items-center">
            <Icon className="w-8 h-8 stroke-current mr-2" />

            <span className="flex-1 w-full text-justify">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
