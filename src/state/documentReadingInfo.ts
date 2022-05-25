import { atomFamily } from "recoil";
import { DocumentReadingInfo } from "~/types";
import { resourceEffect } from "./effects";
import { persistence } from "./persistence";

/**Reading information for document */
export const documentReadingInfo = atomFamily<
  DocumentReadingInfo,
  [accountId: string, documentId: string]
>({
  key: "documentReadingInfo",
  default: ([accountId, documentId]) => ({
    accountId,
    documentId,
  }),
  effects: ([accountId, documentId]) => [
    resourceEffect(persistence.documentReadingInfo(accountId, documentId)),
  ],
});
