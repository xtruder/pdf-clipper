import { Logger } from "winston";

export type Maybe<T> = T | null;

export type uuid = string;

export type jsonb = string;

export type FileUrlOutput = {
  id: uuid;
  url: string;
};

export type Query = {
  file?: Maybe<FileUrlOutput>;
};

export type CreateFileOutput = {
  id: uuid;
  sources: jsonb;
  uploadUrl: string;
};

export type Mutations = {
  insertFile?: CreateFileOutput;
};

export type createFileArgs = {
  sources?: Maybe<jsonb>;
  createdBy: string;
};
