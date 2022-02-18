import React, { useCallback, useState } from "react";

import { ReactComponent as ExclamationCircleIcon } from "../assets/icons/exclamation-circle-outline.svg";

import { useDropzone } from "react-dropzone";

export interface DocumentDropZoneProps {}

export const DocumentDropZone: React.FC<DocumentDropZoneProps> = ({}) => {
  const [readerErrorStr, setReaderErrorStr] = useState<string | null>(null);
  //const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onabort = () => setReaderErrorStr("file reading was aborted");
    reader.onerror = () => setReaderErrorStr("error reading files");
    reader.onload = () => {
      //const binaryStr = reader.result;

      setReaderErrorStr(null);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // only one file for now
    maxSize: 100 * 100000, // 100 MB for now, so we don't eat all memory
    accept: "application/pdf", // accept only pdf for now
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
      className="flex bg-base-200 rounded-lg p-2 h-full w-full p-2"
    >
      <input {...getInputProps()} />

      <div className="flex justify-center items-center text-center h-full w-full bg-base-100 border-1 border-dashed rounded-md px-2">
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
