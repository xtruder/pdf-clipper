import { atomFamily } from "recoil";

import { FileInfo } from "~/types";

import { resourceEffect } from "./effects";
import { persistence } from "./persistence";

export const fileInfo = atomFamily<FileInfo, string>({
  key: "fileSources",
  default: (id) => ({
    id,
    sources: [],
  }),
  effects: (fileId) => [resourceEffect(persistence.fileInfo(fileId))],
});
