import React, { Suspense, useCallback, useState } from "react";
import { suspend } from "suspend-react";
import { ErrorBoundary } from "react-error-boundary";

import { gql } from "urql";
import { useMyMutation } from "~/gql/hooks";
import { DocumentType } from "~/gql/graphql";

import { canvasToPNGBlob } from "~/lib/dom";

import {
  DocumentDropZone,
  ErrorFallback,
  getDocumentOutline,
  getPageCanvasArea,
  loadPDF,
  TopbarProgressIndicator,
  useContextProgress,
} from "@pdf-clipper/components";

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

const mimeToDocType: Record<string, string> = {
  "application/pdf": "PDF",
};

export const DocumentDropContainer: React.FC<{
  className: string;
}> = ({ className }) => {
  const DocumentDropZoneLoader = useCallback(() => {
    const [, uploadBlob] = useMyMutation(uploadBlobMutation);
    const [, createDocument] = useMyMutation(createDocumentMutation);

    const [file, setFile] = useState<File>();
    const { setProgress, setMessage } = useContextProgress();

    suspend(async () => {
      if (!file) return;

      const docType = mimeToDocType[file.type || ""];
      if (!docType) throw new Error("invalid file type: " + file.type);

      const { data, error } = await uploadBlob({
        blob: {
          blob: file,
          mimeType: file.type,
        },
      });

      if (error || !data) throw error;

      const {
        uploadBlob: { hash: fileHash },
      } = data;

      if (docType === "PDF") {
        setMessage("loading pdf");

        const pdfDocument = await loadPDF(file, ({ loaded, total }) =>
          setProgress(total / loaded)
        );

        setMessage("getting document metadata");

        // get pdf document metadata
        const { info }: { info: any } = await pdfDocument.getMetadata();

        // get first page and screenshot page as cover
        const page1 = await pdfDocument.getPage(1);
        const cover = await canvasToPNGBlob(
          await getPageCanvasArea(page1, { width: 600 })
        );

        // upload cover page
        const { data: coverData, error: coverError } = await uploadBlob({
          blob: {
            blob: cover,
            mimeType: cover.type,
          },
        });

        if (!coverData || coverError) throw coverError;

        const {
          uploadBlob: { hash: coverHash },
        } = coverData;

        // get pdf document outline
        const outline = await getDocumentOutline(pdfDocument);

        setMessage("creating document");

        // create the actual document
        const { data, error } = await createDocument({
          input: {
            type: DocumentType.Pdf,
            fileHash,
            meta: {
              pageCount: pdfDocument.numPages,
              title: info["Title"],
              author: info["Author"],
              outline,
            },
            coverHash,
          },
        });
        if (error || !data) throw error;

        setMessage("");
      }
    }, [file]);

    return <DocumentDropZone onFile={setFile} className={className} />;
  }, [className]);

  return (
    <Suspense
      fallback={
        <DocumentDropZone
          disabled={true}
          loader={<TopbarProgressIndicator {...useContextProgress()} />}
        />
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DocumentDropZoneLoader />
      </ErrorBoundary>
    </Suspense>
  );
};
