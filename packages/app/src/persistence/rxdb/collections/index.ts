import * as accounts from "./accounts";
import * as accountinfos from "./accountinfos";
import * as sessions from "./sessions";
import * as documents from "./documents";
import * as documentmembers from "./documentmembers";
import * as documenthighlights from "./documenthighlights";
import * as blobinfos from "./blobinfos";
import { RxCollectionCreator } from "rxdb";

export * from "./types";

const collectionCreators = {
  accounts,
  accountinfos,
  sessions,
  documents,
  documentmembers,
  documenthighlights,
  blobinfos,
};

// type check collection creators
collectionCreators as Record<string, RxCollectionCreator>;

export default collectionCreators;
