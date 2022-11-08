import React, { useEffect, useState } from "react";

import { Story } from "@storybook/react";
import { DocumentDropZone } from "./DocumentDropZone";
import { useRandomProgress } from "./ProgressIndicator";

export default {
  title: "ui/DocumentDropZone",
};

export const TheDocumentDropZone: Story = (args) => {
  const [randDuration, setRandDuration] = useState(1000);
  const [showProgress, setShowProgress] = useState(args.showProgress);
  const [error, setError] = useState<Error | boolean>(false);
  const [success, setSuccess] = useState(false);
  const [lastFile, setLastFile] = useState<File>();
  const progress = useRandomProgress(randDuration);

  const reset = () => {
    setError(false);
    setSuccess(false);
  };

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(reset, 2000);
      return () => clearTimeout(t);
    }

    return () => {};
  }, [error, success]);

  useEffect(() => {
    if (args.error) setError(new Error(args.error));
  }, [args.error]);
  useEffect(() => setSuccess(args.success), [args.success]);

  useEffect(() => setShowProgress(args.progress), [args.progress]);
  useEffect(() => {
    if (progress === 1) {
      setShowProgress(false);

      if (args.success && lastFile) {
        setSuccess(true);
      } else if (lastFile) {
        setError(args.error === "" ? true : new Error(args.error));
      }
    }
  }, [progress]);

  return (
    <div className="p-2 w-200 h-40">
      <DocumentDropZone
        accept={args.accept}
        progress={showProgress && { progress }}
        disabled={args.disabled}
        error={error}
        success={success}
        onFile={(file) => {
          args.onFile(file);

          reset();

          setRandDuration(Math.random() * 5000 + 500);
          setShowProgress(true);
          setLastFile(file);
        }}
        onFileRejected={(file) => {
          args.onFileRejected(file);

          setError(new Error(file.errors[0]!.message));
        }}
      />
    </div>
  );
};

TheDocumentDropZone.args = {
  showProgress: false,
  disabled: false,
  accept: {
    "application/pdf": [],
  },
  error: "",
  success: false,
};

TheDocumentDropZone.argTypes = {
  onFile: {
    action: "file",
  },
  onFileRejected: {
    action: "file rejected",
  },
};
