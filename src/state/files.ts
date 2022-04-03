import { atomFamily } from "recoil";

import { FileInfo } from "~/models/files";
import { resourceEffect } from "./effects";
import { persistence } from "./state";

export const fileInfo = atomFamily<FileInfo, string>({
  key: "fileSources",
  default: (id) => ({
    id,
    sources: [],
  }),
  effects: (fileId) => [resourceEffect(persistence.fileInfo(fileId))],
});
