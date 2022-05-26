import { atomFamily } from "recoil";

import { FileInfo } from "~/types";

import { rxDocumentEffect } from "./effects";
import { currentAccountId, db } from "./persistence";

export const fileInfo = atomFamily<FileInfo, string>({
  key: "fileSources",
  default: (id) => ({
    id,
    sources: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: currentAccountId,
  }),
  effects: (fileId) => [rxDocumentEffect(db.file_info, fileId)],
});
