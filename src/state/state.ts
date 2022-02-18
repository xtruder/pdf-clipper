import { createContext } from "react";
import { RecoilState, RecoilValueReadOnly } from "recoil";

import {
  Account,
  DocumentInfo,
  DocumentReadingInfo,
  Highlight,
} from "~/models";

export type State = {
  currentAccount: RecoilState<Account>;
  documentInfoList: RecoilState<DocumentInfo[]>;
  documentReadingInfoList: RecoilState<DocumentReadingInfo[]>;
  documentInfo: (param: string) => RecoilState<DocumentInfo | undefined>;
  documentReadingInfo: (
    param: string
  ) => RecoilValueReadOnly<DocumentReadingInfo | undefined>;
  documentHighlights: (param: string) => RecoilState<Highlight[]>;
};

export const StateCtx = createContext<State>({} as any);
