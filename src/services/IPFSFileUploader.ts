import { debug as _debug } from "debug";
import {
  Subject,
  Observable,
  Subscription,
  mergeMap,
  first,
  of,
  shareReplay,
  tap,
  distinct,
  share,
  filter,
  map,
  pipe,
  forkJoin,
} from "rxjs";
import { IPFSHTTPClient } from "ipfs-http-client";

import { Database } from "../persistence/rxdb";
import { DocumentDocument } from "../persistence/collections/document";

const debug = _debug("services:IPFSFileUploader");

interface DocumentUploadProgress {
  document: DocumentDocument;
  progress: number;
}

// export function runIPFSDocumentFileDownload(
//   db: Database,
//   sessionId: string,
//   ipfs: IPFSHTTPClient,
//   fs: NativeFS
// ) {
//   const sessions = db.sessions.findOne({
//     selector: {
//       id: sessionId,
//     },
//   }).$;

//   return sessions.pipe(
//     // get documents associated with session
//     mergeMap((session) =>
//       db.documents.findByIds$(session?.syncDocuments ?? [])
//     ),
//     mergeMap((result) => result.values()),

//     // process each document
//     groupBy((document) => document.id),
//     mergeMap((group) =>
//       group.pipe(
//         // first emited value that has file source defined
//         first((document) => !!document.file?.source),

//         // check if file already exists
//         mergeMap((document) =>
//           forkJoin({
//             document: of(document),
//             fileExists: fs.fileExists(document.file!.hash),
//           })
//         ),

//         mergeMap(({ document, fileExists }) =>
//           iif<DocumentProgress, DocumentProgress>(
//             () => fileExists,
//             of({ document, progress: 1 }),
//             defer(async function* () {
//               const chunks: Uint8Array[] = [];

//               let total: number = 0;
//               for await (const chunk of ipfs.get(document.file!.source!)) {
//                 chunks.push(chunk);
//                 total += chunk.byteLength;

//                 // report document download progress
//                 yield {
//                   document,
//                   progress: total / document.file!.size,
//                 };
//               }

//               // create blob from downloaded chunks
//               const blob = new Blob(chunks, {
//                 type: document.file!.mimeType,
//               });

//               // save final file content
//               await fs.saveFile(document.file!.hash, blob);
//             })
//           )
//         ),

//         // retry the download
//         retry({ delay: 2000 }),

//         // replay last value
//         shareReplay(1)
//       )
//     ),

//     // reply every document progress
//     shareReplay()
//   );
// }

export interface IPFSFileUploader {
  getUpload: (docId: string) => Observable<DocumentUploadProgress>;
  getFinishedUpload: (docId: string) => Observable<DocumentDocument>;
  startUploading: () => Subscription;
}

export function createIPFSFileUploader(
  db: Database,
  ipfsClient: IPFSHTTPClient
): IPFSFileUploader {
  const docsToUpload$ = db.documents
    .find({
      selector: {
        $and: [
          // have file attached
          { file: { $exists: true } },

          // but no source
          { "file.source": { $exists: false } },
        ],
      },
    })
    .$.pipe(mergeMap((doc) => doc));

  const uploadToIPFS = uploadDocs(uploadDocFileToIPFS(ipfsClient));

  const uploads$ = docsToUpload$.pipe(uploadToIPFS, share());
  const finishedUploads$ = uploads$.pipe(filterFinishedUploads);

  const getUpload = (docId: string) =>
    uploads$.pipe(first(({ document: { id } }) => id === docId));

  const getFinishedUpload = (docId: string) =>
    finishedUploads$.pipe(first(({ id }) => id === docId));

  const startUploading = () => {
    const finishedUploadsSub = finishedUploads$.subscribe();
    const uploadsSub = uploads$.subscribe();

    uploadsSub.add(() => finishedUploadsSub.unsubscribe());

    return uploadsSub;
  };

  return { getUpload, getFinishedUpload, startUploading };
}

const uploadDocFileToIPFS =
  (ipfs: IPFSHTTPClient): UploadDocFileFn =>
  (document, file) => {
    const subject = new Subject<DocumentUploadProgress>();

    ipfs
      .add(file, {
        progress: (bytes) => {
          const progress = bytes / file.size;

          if (progress < 1)
            subject.next({ document, progress: bytes / file.size });
        },
      })
      .then(async ({ cid }) => {
        // add source to document
        document = await document.atomicPatch({
          file: {
            ...document.file!,
            source: `ipfs://${cid.toV1()}`,
          },
        });

        subject.next({ document, progress: 1 });
        subject.complete();

        debug("upload complete", document.id, cid.toV1().toString());
      })
      .catch((err) => subject.error(err));

    return subject.asObservable();
  };

type UploadDocFileFn = (
  doc: DocumentDocument,
  file: File
) => Observable<DocumentUploadProgress>;

const uploadDocs = (uploadDocFileFn: UploadDocFileFn) =>
  pipe(
    // upload each document only once
    distinct((document: DocumentDocument) => document.id),

    // get file associated with document
    mergeMap((document) =>
      forkJoin({
        document: of(document),
        file: document.getCachedFile(),
      })
    ),

    tap(({ document }) => debug("uploading file", document.id)),

    // do the actual upload
    mergeMap(({ document, file }) => uploadDocFileFn(document, file!)),

    tap(({ document, progress }) =>
      debug("document upload progress", document.id, progress)
    )
  );

const filterFinishedUploads = pipe(
  filter(({ progress }: DocumentUploadProgress) => progress === 1),
  map(({ document }) => document!),
  shareReplay(1)
);
