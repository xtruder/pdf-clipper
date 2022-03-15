import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { createContext, useContext } from "react";
import { RecoilState, RecoilValueReadOnly } from "recoil";

import {
  Account,
  DocumentInfo,
  DocumentReadingInfo,
  DocumentSources,
  Highlight,
} from "~/models";
import { PDFDocumentMeta } from "~/models/pdf";

export type State = {
  currentAccount: RecoilState<Account>;
  documentSources: (id: string) => RecoilState<DocumentSources>;
  documentInfo: (id: string) => RecoilState<DocumentInfo>;
  documentReadingInfo: (id: string) => RecoilValueReadOnly<DocumentReadingInfo>;
  documentHighlights: (id: string) => RecoilState<Highlight[]>;
  documentHighlightImage: (
    args: [string, string]
  ) => RecoilValueReadOnly<string | undefined>;
  pdfDocumentProxy: (id: string) => RecoilValueReadOnly<PDFDocumentProxy>;
  documentLoadProgress: (id: string) => RecoilValueReadOnly<number>;
  pdfDocumentMeta: (id: string) => RecoilValueReadOnly<PDFDocumentMeta>;
  pdfDocumentPages: (id: string) => RecoilValueReadOnly<PDFPageProxy[]>;
  pdfPageThumbnail: (
    p: [string, number]
  ) => RecoilValueReadOnly<string | undefined>;
};

export const StateCtx = createContext<State>({} as any);

export const useStateCtx = () => useContext(StateCtx);
