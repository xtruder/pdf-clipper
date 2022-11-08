import React, { useEffect, useState } from "react";

import { gql } from "urql";
import { debug } from "debug";
import { toast } from "react-toastify";

import { useMyMutation } from "~/gql/hooks";
import { CreateDocumentInput, DocumentType } from "~/gql/graphql";

import { canvasToPNGBlob } from "~/lib/dom";

import {
  DocumentDropZone,
  getDocumentOutline,
  getPageCanvasArea,
  loadPDF,
} from "@pdf-clipper/components";

const log = debug("DocumentDropContainer");

const createDocumentMutation = gql(`
  mutation createDocument($input: CreateDocumentInput!) {
    createDocument(document: $input) {
      id
    }
  }
`);

const uploadBlobMutation = gql(`
  mutation uploadBlob($blob: UploadBlobInput!) {
    uploadBlob(blob: $blob) {
      hash
    }
  }
`);

const mimeToDocType: Record<string, DocumentType> = {
  "application/pdf": DocumentType.Pdf,
};

export const DocumentDropContainer: React.FC<{
  className: string;
  onDocument?: (id: string) => void;
}> = ({ className, onDocument }) => {
  const [, uploadBlob] = useMyMutation(uploadBlobMutation, {
    throwOnError: true,
  });
  const [, createDocument] = useMyMutation(createDocumentMutation, {
    throwOnError: true,
  });

  const [progress, setProgress] = useState<number>();
  const [error, setError] = useState<Error>();
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setError(undefined);
    setSuccess(false);
  };

  const onFile = async (file: File) => {
    reset();

    try {
      const {
        data: {
          uploadBlob: { hash: fileHash },
        },
      } = await uploadBlob({
        blob: {
          blob: file,
          mimeType: file.type,
        },
      });

      const docType = mimeToDocType[file.type];

      if (docType === "PDF") {
        log("loading pdf", file.name);

        const pdfDocument = await loadPDF(file, ({ loaded, total }) =>
          setProgress(total / loaded)
        );

        log("getting document metadata", pdfDocument._pdfInfo);

        // get pdf document metadata
        const { info }: { info: any } = await pdfDocument.getMetadata();

        // get first page and screenshot page as cover
        const page1 = await pdfDocument.getPage(1);
        const cover = await canvasToPNGBlob(
          await getPageCanvasArea(page1, { width: 600 })
        );

        // upload cover page
        const {
          data: {
            uploadBlob: { hash: coverHash },
          },
        } = await uploadBlob({
          blob: {
            blob: cover,
            mimeType: cover.type,
          },
        });

        // get pdf document outline
        const outline = await getDocumentOutline(pdfDocument);

        const input: CreateDocumentInput = {
          type: DocumentType.Pdf,
          fileHash,
          meta: {
            pageCount: pdfDocument.numPages,
            title: info["Title"],
            author: info["Author"],
            outline,
          },
          coverHash,
        };

        log("creating document", input);

        // create the actual document
        const {
          data: {
            createDocument: { id },
          },
        } = await createDocument({
          input,
        });

        onDocument?.(id);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err);
      toast.error(`Upload error: ${err.message}`);
    }

    setProgress(undefined);
  };

  useEffect(() => {
    const t = error || success ? setTimeout(reset, 5000) : undefined;
    return () => clearTimeout(t);
  }, [error, success]);

  return (
    <DocumentDropZone
      className={className}
      accept={{
        "application/pdf": [],
      }}
      onFile={onFile}
      onFileRejected={(file) => setError(new Error(file.errors[0]!.message))}
      error={error}
      success={success}
      progress={progress}
    />
  );
};
