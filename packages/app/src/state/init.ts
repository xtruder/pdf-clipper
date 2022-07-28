import { debug } from "debug";
import { create as createIPFSHttpClient } from "ipfs-http-client";

import { BlobStore } from "~/persistence/blobstore";
import { IPFSClient } from "~/persistence/ipfs";
import { NativeFSBlobCache } from "~/persistence/nativefs";
import { Database, initDB } from "~/persistence/rxdb";

import {
  createPDFHighlightScreenshotter,
  createPDFLoader,
  createPDFMetaExtractor,
  PDFLoader,
} from "~/services";

const log = debug("services");

export let db: Database;
export let ipfs: IPFSClient;
export let pdfLoader: PDFLoader;
export let blobStore: BlobStore;

export async function initPersistence() {
  console.log("app starting");

  db = await initDB();
  ipfs = new IPFSClient(
    createIPFSHttpClient({
      url: "https://ipfs.infura.io:5001/api/v0",
    })
  );

  blobStore = new BlobStore(db, await NativeFSBlobCache.usePrivateDirectory());
  blobStore.addLoader("docfile", ipfs);
  blobStore.addLoader("highlightimg", ipfs);
  blobStore.startUploader();

  pdfLoader = createPDFLoader(db, blobStore);
}

export function initServices() {
  db.waitForLeadership().then(async () => {
    log("leader elected");

    createPDFHighlightScreenshotter(db, pdfLoader, blobStore).start();
    createPDFMetaExtractor(db, pdfLoader).start();

    log("services intialized");
  });

  return () => {};
}
