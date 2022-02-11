import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { DocumentInfoCard } from "~/components/DocumentInfoCard";
import { StateCtx } from "~/state/state";

export interface MainPageProps {}

export const MainPage: React.FC<MainPageProps> = ({}) => {
  const navigate = useNavigate();
  const { documentInfoList } = useContext(StateCtx);
  const documentInfos = useRecoilValue(documentInfoList);

  return (
    <ul>
      {documentInfos.map((info) => (
        <li key={info.id}>
          <DocumentInfoCard
            title={info.title}
            description={info.description}
            cover={info.cover}
            onOpen={() => navigate(`/viewpdf/${info.id}`)}
          />
        </li>
      ))}
    </ul>
  );
};
