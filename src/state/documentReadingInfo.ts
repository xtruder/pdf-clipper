import { atomFamily } from "recoil";

import { DocumentReadingInfo } from "~/types";

import { rxDocumentEffect } from "./effects";
import { db } from "./persistence";

/**Reading information for document */
export const documentReadingInfo = atomFamily<
  DocumentReadingInfo,
  [string, string]
>({
  key: "documentReadingInfo",
  default: ([accountId, documentId]) => ({
    id: `${accountId}|${documentId}`,
    accountId,
    documentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  effects: ([accountId, documentId]) => [
    rxDocumentEffect(db.document_reading_info, `${accountId}|${documentId}`),
  ],
});
