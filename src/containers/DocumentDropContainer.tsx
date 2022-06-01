import React from "react";

import { FileInfo, useMutation } from "~/gqty";

import { DocumentDropZone } from "~/components/ui/DocumentDropZone";

export const DocumentDropContainer: React.FC<{
  onUpload: (fileInfo: FileInfo, file: File) => void;
  className: string;
}> = ({ onUpload, className }) => {
  const [uploadFile] = useMutation(
    (mutation, file: File) =>
      mutation.uploadFile({
        file,
      }),
    {
      nonSerializableVariables: true,
      suspense: false,
    }
  );

  const onFile = async (file: File) => {
    const fileInfo = await uploadFile({ args: file });

    onUpload(fileInfo, file);
  };

  return <DocumentDropZone onFile={onFile} className={className} />;
};
