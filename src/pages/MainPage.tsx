import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AccountDocumentsListContainer } from "~/containers/DocumentListContainer";
import { DocumentDropContainer } from "~/containers/DocumentDropContainer";

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  useEffect(() => () => console.log("main page recreated", []));

  const navigate = useNavigate();

  const onOpen = useCallback(
    (docId: string, source: string) => navigate(`/document/${source}/${docId}`),
    []
  );

  return (
    <div className="h-screen flex flex-col p-1">
      <DocumentDropContainer className="flex-none grow-0" />

      <div className="divider" />

      <AccountDocumentsListContainer className="flex-1 p-1" onOpen={onOpen} />
    </div>
  );
};
