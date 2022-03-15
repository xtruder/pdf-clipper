import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DocumentListContainer } from "~/containers/DocumentListContainer";

import { StateCtx } from "~/state/state";

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();

  const { currentAccount } = useContext(StateCtx);
  const { documentIds } = useRecoilValue(currentAccount);

  return (
    <DocumentListContainer
      documentIds={documentIds}
      onOpen={(docId) => navigate(`/document/${docId}`)}
    />
  );
};
