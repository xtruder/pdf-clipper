import { atom, atomFamily, selector, selectorFamily } from "recoil";

import { s4 } from "~/lib/utils";
import {
  Account,
  DocumentInfo,
  DocumentReadingInfo,
  Highlight,
  DocumentType,
} from "~/models";
import { State } from "./state";

const getCurrentAccount = selector<Account>({
  key: "getCurrentAccount",
  get: async () => {
    return { id: s4() };
  },
});

export const currentAccount = atom<Account>({
  key: "currentAccount",
  default: getCurrentAccount,
});

export const documentInfoList = atom<DocumentInfo[]>({
  key: "documentInfoList",
  default: [
    {
      type: DocumentType.PDF,
      id: s4(),
      title: "neki",
      url: "https://arxiv.org/pdf/1708.08021.pdf",
    },
  ],
});

export const documentReadingInfoList = atom<DocumentReadingInfo[]>({
  key: "documentReadingInfos",
  default: [],
});

export const documentHighlights = atomFamily<Highlight[], string>({
  key: "documentHighlights",
  default: [],
});

export const documentInfo = selectorFamily<DocumentInfo | undefined, string>({
  key: "documentInfo",
  get:
    (id) =>
    ({ get }) => {
      const docs = get(documentInfoList);

      return docs.find((d) => d.id === id);
    },
});

export const documentReadingInfo = selectorFamily<
  DocumentReadingInfo | undefined,
  string
>({
  key: "documentReadingInfo",
  get:
    (id) =>
    ({ get }) => {
      const docs = get(documentReadingInfoList);

      return docs.find((d) => d.documentId === id);
    },
});

export const localState: State = {
  currentAccount,
  documentInfoList,
  documentReadingInfoList,
  documentHighlights,
  documentInfo,
  documentReadingInfo,
};
