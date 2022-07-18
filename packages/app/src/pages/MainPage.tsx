import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useAtomValue, useSetAtom } from "jotai";

import { DocumentDropZone } from "@pdf-clipper/components";

import { AccountDocumentsListContainer } from "~/containers/DocumentListContainer";
import {
  currentAccountAtom,
  documentAtom,
  documentFileAtom,
  documentMembersAtom,
} from "~/state";

const mimeToDocType: Record<string, string> = {
  "application/pdf": "PDF",
};

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  const { id: accountId } = useAtomValue(currentAccountAtom);
  const [newDocumentId, setNewDocumentId] = useState(uuid());
  const updateDocument = useSetAtom(documentAtom(newDocumentId));
  const setDocumentMembers = useSetAtom(documentMembersAtom(newDocumentId));
  const setDocumentFile = useSetAtom(documentFileAtom(newDocumentId));

  const onUpload = useCallback(
    async (file: File) => {
      const docType = mimeToDocType[file.type || ""];

      if (!docType) throw new Error(`unsupported mime type ${file.type}`);

      if (docType === "PDF") {
        // update document metadata
        updateDocument({
          type: "PDF",
          meta: {},
          createdBy: accountId,
        });

        setDocumentFile(file);

        setDocumentMembers({
          action: "create",
          value: {
            accountId,
            documentId: newDocumentId,
            role: "admin",
          },
        });
      }

      setNewDocumentId(uuid());
    },
    [newDocumentId]
  );

  return (
    <div className="h-screen flex flex-col p-1">
      <DocumentDropZone className="flex-none grow-0" onFile={onUpload} />

      <div className="divider"></div>

      <AccountDocumentsListContainer
        className="flex-1"
        onOpen={(docId) => navigate(`/document/${docId}`)}
      />
    </div>
  );
};
