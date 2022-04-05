import { atomFamily } from "recoil";
import { DocumentReadingInfo } from "~/types";
import { resourceEffect } from "./effects";
import { persistence } from "./persistence";

/**Reading information for document */

export const documentReadingInfo = atomFamily<
  DocumentReadingInfo,
  [string, string]
>({
  key: "documentReadingInfo",
  default: ([accountId, docId]) => ({
    id: `${accountId}|${docId}`,
    accountId,
    docId,
  }),
  effects: ([accountId, docId]) => [
    resourceEffect(persistence.documentReadingInfo(accountId, docId)),
  ],
});
