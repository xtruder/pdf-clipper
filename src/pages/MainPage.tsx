import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { v4 as uuidv4 } from "uuid";
import { debug as _debug } from "debug";

import {
  currentAccount,
  currentAccountId,
  documentInfo,
  fileInfo,
} from "~/state";

import { DocumentListContainer } from "~/containers/DocumentListContainer";
import { DocumentDropZone } from "~/components/DocumentDropZone";
import { DocumentType } from "~/types";
import { sha256 } from "~/lib/crypto";
import { fs } from "~/state";
import { paths } from "~/state/const";

const debug = _debug("main");

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  const accountInfo = useRecoilValue(currentAccount);
  const setCurrentAccout = useSetRecoilState(currentAccount);

  const documentIds = accountInfo?.documents.map((doc) => doc.documentId) || [];

  const [uploadState, setUploadState] = useState<{
    fileHash: string;
    documentId: string;
    file?: ArrayBuffer;
  }>({
    fileHash: "",
    documentId: "",
  });

  const setFileInfo = useSetRecoilState(fileInfo(uploadState.fileHash));
  const setDocumentInfo = useSetRecoilState(
    documentInfo(uploadState.documentId)
  );

  const onUpload = async (file: ArrayBuffer) => {
    // get sha256 of file and use it as file id
    const fileId = await sha256(file);

    debug("file hash: ", fileId);

    // get uuid of document
    const documentId = uuidv4();

    setUploadState({
      fileHash: fileId,
      documentId,
      file,
    });
  };

  useEffect(
    (async () => {
      if (!uploadState.documentId || !uploadState.fileHash || !uploadState.file)
        return;

      // save uploaded file locally
      await fs.saveFile(
        paths.file(uploadState.fileHash, "pdf"),
        uploadState.file
      );

      setFileInfo({
        hash: uploadState.fileHash,

        // no sources defined until file is uploaded somewhere, will use local
        // saved file
        sources: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        createdBy: currentAccountId,
      });

      setDocumentInfo({
        id: uploadState.documentId,
        type: DocumentType.PDF,
        fileHash: uploadState.fileHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentAccountId,
        meta: {},
        members: [],
      });

      setCurrentAccout((val) => ({
        ...val,
        documents: [
          ...val?.documents,
          {
            createdAt: new Date().toISOString(),
            documentId: uploadState.documentId,
            role: "admin",
          },
        ],
      }));
    }) as any,
    [uploadState]
  );

  return (
    <div className="h-screen flex flex-col p-1">
      <DocumentDropZone className="flex-none grow-0" onFile={onUpload} />

      <div className="divider"></div>

      <DocumentListContainer
        className="flex-1"
        documentIds={documentIds}
        onOpen={(docId) => navigate(`/document/${docId}`)}
      />
    </div>
  );
};
