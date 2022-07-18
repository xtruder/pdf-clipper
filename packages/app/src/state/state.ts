import { v4 as uuid } from "uuid";
import { atom } from "jotai";
import { atomFamily, atomWithObservable } from "jotai/utils";

import { db, pdfLoader } from "./init";
import { syncableRxDocumentAtom, syncableRxDocumentsAtom } from "./utils";

import {
  Account,
  AccountInfo,
  Document,
  DocumentHighlight,
  DocumentMember,
} from "~/types";
import {
  filter,
  find,
  first,
  firstValueFrom,
  map,
  mergeMap,
  iif,
  defer,
  of,
  shareReplay,
} from "rxjs";
import { blobToDataURL } from "~/lib/dom";

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
  atom(async () => {
    const document = await db.documents
      .findOne({
        selector: {
          id: documentId,
        },
      })
      .$.pipe(first((v) => !!v))
      .toPromise();

    return document!.getCachedFile();
  })
);

export const documentFileAtom = atomFamily((documentId: string) =>
  atom<File | null, File>(
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

      await document!.putFile(file);
    }
  )
);

const documentHighlightImageAtomData = atomFamily(
  ([documentId, highlightId]: [string, string]) =>
    atomWithObservable(() =>
      db.documenthighlights
        .findOne({ selector: { documentId, highlightId } })
        .$.pipe(
          find((h) => !!h),
          map((h) => h!.getCachedImage())
        )
    )
);

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
    db.documenthighlights.findOne({ selector: { id: highlightId } }).$.pipe(
      filter((doc) => !!doc),
      map((v) => v!)
    )
  )
);

export const documentHighlightImageAtom = atomFamily((highlightId: string) =>
  atomWithObservable(() =>
    db.documenthighlights.findOne({ selector: { id: highlightId } }).$.pipe(
      mergeMap((doc) =>
        iif(
          () => !!doc?.image,
          defer(async () => {
            const imageBlob = await doc!.getCachedImage();
            if (!imageBlob) return null;

            return await blobToDataURL(imageBlob);
          }),
          of(null)
        )
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    )
  )
);

/**atom that subscribes to document highlights */
export const documentHighlightsAtom = atomFamily((documentId: string) =>
  syncableRxDocumentsAtom<DocumentHighlight>(() =>
    db.documenthighlights.find({ selector: { documentId } })
  )
);

export const pdfLoaderAtom = atomFamily((documentId: string) =>
  atomWithObservable(() => pdfLoader.getLoadedPDF(documentId))
);
