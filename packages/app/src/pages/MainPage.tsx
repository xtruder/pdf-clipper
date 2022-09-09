import React from "react";
import { useNavigate } from "react-router-dom";

import { AccountDocumentsListContainer } from "~/containers/DocumentListContainer";
import { DocumentDropContainer } from "~/containers/DocumentDropContainer";

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col p-1">
      <DocumentDropContainer className="flex-none grow-0" />

      <div className="divider"></div>

      <AccountDocumentsListContainer
        className="flex-1"
        onOpen={(docId) => navigate(`/document/${docId}`)}
      />
    </div>
  );
};
