import { debug } from "debug";
import { create as createIPFSHttpClient } from "ipfs-http-client";
import { IPFSClient } from "~/persistence/ipfs";

import { NativeFS } from "~/persistence/nativefs";
import { Database, initDB } from "~/persistence/rxdb";

import {
  createIPFSFileUploader,
  createIPFSHighlightImageUploader,
  createPDFHighlightScreenshotter,
  createPDFLoader,
  createPDFMetaExtractor,
  PDFLoader,
} from "~/services";

const log = debug("services");

export let db: Database;
export let fs: NativeFS;
export let ipfs: IPFSClient;
export let pdfLoader: PDFLoader;

export async function initPersistence() {
  console.log("app starting");

  fs = await NativeFS.usePrivateDirectory();
  db = await initDB(fs);
  pdfLoader = createPDFLoader(db);
  ipfs = new IPFSClient(
    createIPFSHttpClient({
      url: "https://ipfs.infura.io:5001/api/v0",
    })
  );
}

export function initServices() {
  db.waitForLeadership().then(async () => {
    log("leader elected");

    createIPFSFileUploader(db, ipfs).startUploading();
    createIPFSHighlightImageUploader(db, ipfs).start();
    createPDFHighlightScreenshotter(db, pdfLoader).start();
    createPDFMetaExtractor(db, pdfLoader).start();

    log("services intialized");
  });

  return () => {};
}
