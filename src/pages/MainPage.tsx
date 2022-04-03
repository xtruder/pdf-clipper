import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { v4 as uuidv4 } from "uuid";
import { debug as _debug } from "debug";

import { currentAccount, documentInfo, fileInfo } from "~/state";

import { DocumentListContainer } from "~/containers/DocumentListContainer";
import { DocumentDropZone } from "~/components/DocumentDropZone";
import { DocumentType } from "~/models";
import { sha256 } from "~/lib/crypto";
import { getPrivateDirectory } from "~/state/state";
import { paths } from "~/state/const";

const debug = _debug("main");

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  const { documentIds } = useRecoilValue(currentAccount);
  const setCurrentAccout = useSetRecoilState(currentAccount);

  const [uploadState, setUploadState] = useState<{
    fileId: string;
    documentId: string;
    file?: ArrayBuffer;
  }>({
    fileId: "",
    documentId: "",
  });

  const setFileInfo = useSetRecoilState(fileInfo(uploadState.fileId));
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
      fileId,
      documentId,
      file,
    });
  };

  useEffect(
    (async () => {
      if (!uploadState.documentId || !uploadState.fileId || !uploadState.file)
        return;

      // save uploaded file locally
      await (
        await getPrivateDirectory()
      ).saveFile(paths.file(uploadState.fileId, "pdf"), uploadState.file);

      setFileInfo({
        id: uploadState.fileId,

        // no sources defined until file is uploaded somewhere, will use local
        // saved file
        sources: [],
      });

      setDocumentInfo({
        id: uploadState.documentId,
        type: DocumentType.PDF,
        fileId: uploadState.fileId,
      });

      setCurrentAccout((val) => ({
        ...val,
        documentIds: [uploadState.documentId, ...val.documentIds],
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
