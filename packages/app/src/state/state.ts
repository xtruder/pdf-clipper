import { v4 as uuid } from "uuid";
import {
  filter,
  first,
  firstValueFrom,
  map,
  mergeMap,
  shareReplay,
  from,
} from "rxjs";

import { atom } from "jotai";
import { atomFamily, atomWithObservable } from "jotai/utils";

import { blobStore, db, pdfLoader } from "./init";
import { syncableRxDocumentAtom, syncableRxDocumentsAtom } from "./utils";

import {
  Account,
  AccountInfo,
  Document,
  DocumentHighlight,
  DocumentMember,
} from "~/types";
/**atom that subscribes to current account */
export const currentAccountAtom = syncableRxDocumentAtom<Account>(
  () =>
    db.accounts.findOne({
      selector: {
        default: true,
      },
    }),
  () => ({ id: uuid(), default: true })
);

/**atom family for getting information about accounts */
export const accountInfoAtom = atomFamily((accountId: string) =>
  syncableRxDocumentAtom<AccountInfo>(
    () => db.accountinfos.findOne(accountId),
    () => ({ id: accountId })
  )
);

/**atom family for information about individual documents */
export const documentAtom = atomFamily((documentId: string) =>
  syncableRxDocumentAtom<Document>(
    () => db.documents.findOne(documentId),
    () => ({ id: documentId })
  )
);

const documentFileAtomData = atomFamily((documentId: string) =>
  atom<Promise<Blob | null>>(async () => {
    const document = await firstValueFrom(
      db.documents
        .findOne({
          selector: {
            id: documentId,
            source: { $exists: true },
          },
        })
        .$.pipe(
          filter((v) => !!v),
          map((v) => v!)
        )
    );

    if (!document.fileHash) return null;

    return blobStore.load(document.fileHash);
  })
);

export const documentFileAtom = atomFamily((documentId: string) =>
  atom<Blob | null, Blob>(
    (get) => get(documentFileAtomData(documentId)),
    async (_get, _set, file) => {
      const document = await firstValueFrom(
        db.documents
          .findOne({
            selector: {
              id: documentId,
            },
          })
          .$.pipe(first((v) => !!v))
      );

      const { hash } = await blobStore.store("docfile", file);
      await document?.atomicPatch({ fileHash: hash });
    }
  )
);

// const documentHighlightImageAtomData = atomFamily(
//   ([documentId, highlightId]: [string, string]) =>
//     atomWithObservable(() =>
//       db.documenthighlights
//         .findOne({ selector: { documentId, highlightId } })
//         .$.pipe(
//           find((h) => !!h),
//           map((h) => h!.getCachedImage())
//         )
//     )
// );

export const documentsAtom = syncableRxDocumentsAtom<Document>(() =>
  db.documents.find()
);

/**atom to synchnorize all document members */
export const documentMembersAtom = atomFamily((documentId: string) =>
  syncableRxDocumentsAtom<DocumentMember>(() =>
    db.documentmembers.find({ selector: { documentId } })
  )
);

export const accountDocumentsAtom = atomFamily((accountId: string) =>
  syncableRxDocumentsAtom<DocumentMember>(() =>
    db.documentmembers.find({ selector: { accountId } })
  )
);

/**atom to create or update a single document highlight */
export const documentHighlightAtom = atomFamily((highlightId: string) =>
  atomWithObservable(() =>
    db.documenthighlights
      .findOne({
        selector: { id: highlightId },
      })
      .$.pipe(
        filter((doc) => !!doc),
        map((v) => v!)
      )
  )
);

export const documentHighlightImageAtom = atomFamily((highlightId: string) =>
  atomWithObservable(
    () => {
      const docHighlight$ = db.documenthighlights
        .findOne({
          selector: {
            $and: [
              { id: highlightId },
              { imageHash: { $exists: true, $ne: null } },
            ],
          },
        })
        .$.pipe(
          filter((doc) => !!doc),
          map((doc) => doc!)
        );

      return docHighlight$.pipe(
        mergeMap((doc) => from(blobStore.loadAsDataURL(doc.imageHash!))),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
    },
    { initialValue: null }
  )
);

/**atom that subscribes to document highlights */
export const documentHighlightsAtom = atomFamily((documentId: string) =>
  syncableRxDocumentsAtom<DocumentHighlight>(() =>
    db.documenthighlights.find({
      selector: { documentId },
      sort: [{ sequence: "asc" }],
    })
  )
);

export const pdfLoaderAtom = atomFamily((documentId: string) =>
  atomWithObservable(() => pdfLoader.getLoadedPDF(documentId))
);

export const pdfLoadProgressAtom = atomFamily((documentId: string) =>
  atomWithObservable(() =>
    pdfLoader.getPDF(documentId).pipe(map((loader) => loader.progress))
  )
);
