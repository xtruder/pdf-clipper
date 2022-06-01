import React from "react";

import { DocumentDropZone } from "~/components/ui/DocumentDropZone";
import { useUploadFile } from "~/graphql";

export const DocumentDropContainer: React.FC<{
  onUpload: (file: File, hash: string, mimeType: string) => void;
  className: string;
}> = ({ onUpload, className }) => {
  const [uploadFile] = useUploadFile();

  const onFile = async (file: File) => {
    console.log(file);
    const fileInfo = await uploadFile({ variables: { file } });

    if (!fileInfo.data) throw new Error("missing response");

    const { hash, mimeType } = fileInfo.data.uploadFile;

    onUpload(file, hash, mimeType);
  };

  return <DocumentDropZone onFile={onFile} className={className} />;
};
