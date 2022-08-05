import { PDFDocumentProxy } from "pdfjs-dist";
import {
  map,
  Observable,
  of,
  shareReplay,
  first,
  mergeMap,
  tap,
  BehaviorSubject,
} from "rxjs";
import debug from "debug";

import { loadPDF, PDFLoadProgress } from "~/lib/pdfjs";

import { Database, DocumentDocument } from "~/persistence/rxdb";
import { BlobStore } from "~/persistence/blobstore";

const log = debug("services:PDFloader");

export interface PDFLoadStatus {
  pdf: PDFDocumentProxy | null;
  progress?: PDFLoadProgress;
}

export interface PDFDocumentLoadable {
  documentId: string;
  loader: Observable<PDFLoadStatus>;
}

export interface PDFLoader {
  /**PDF document loader observable */
  loader$: Observable<PDFDocumentLoadable>;

  /**gets pdf observable with loading status */
  getPDF: (documentId: string) => Observable<PDFLoadStatus>;

  /**gets pdf observable which resolves when pdf has been already loaded */
  getLoadedPDF: (documentId: string) => Observable<PDFDocumentProxy>;
}

export function createPDFLoader(db: Database, store: BlobStore): PDFLoader {
  // find PDF documents
  const pdfDocs$ = db.documents
    .find({
      selector: {
        $and: [
          // type is PDF
          { type: { $eq: "PDF" } },

          // and have file attached
          { fileHash: { $exists: true } },
        ],
      },
    })
    .$.pipe(mergeMap((doc) => doc));

  const createLoadablePDFDocument = (pdfDoc: DocumentDocument) =>
    of(pdfDoc).pipe(
      // load file from hash
      map((pdfDoc) =>
        store.load$(pdfDoc.fileHash!).pipe(
          mergeMap(({ blob, progress }) =>
            blob ? loadPDFFromBlob(blob) : of({ pdf: null, progress })
          ),
          logProgress(pdfDoc.id),
          shareReplay({ bufferSize: 1, refCount: false })
        )
      ),
      // add documentId to loader
      mergeMap((loader) => of({ documentId: pdfDoc.id, loader }))
    );

  const loader$ = pdfDocs$.pipe(
    mergeMap(createLoadablePDFDocument),

    // remember all replies
    shareReplay()
  );

  const getPDF = (id: string): Observable<PDFLoadStatus> =>
    loader$.pipe(
      first((loadable) => loadable.documentId === id),
      mergeMap((loadable) => loadable.loader)
    );

  const getLoadedPDF = (id: string): Observable<PDFDocumentProxy> =>
    getPDF(id).pipe(
      first(({ pdf }) => !!pdf),
      map(({ pdf }) => pdf!)
    );

  return { loader$, getPDF, getLoadedPDF };
}

/**function that loads PDF and reports loading progress */
const loadPDFFromBlob = (blob: Blob): Observable<PDFLoadStatus> => {
  const subject$ = new BehaviorSubject<PDFLoadStatus>({
    pdf: null,
    progress: {
      loaded: 0,
      total: blob.size,
    },
  });

  loadPDF(blob, (progress) => subject$.next({ pdf: null, progress }))
    .then((pdf) =>
      subject$.next({
        pdf,
        progress: {
          total: blob.size,
          loaded: blob.size,
        },
      })
    )
    .catch((err) => subject$.error(err));

  return subject$;
};

const logProgress = (docId: string) =>
  tap(
    ({
      progress: { loaded, total } = { loaded: 0, total: 0 },
      pdf,
    }: PDFLoadStatus) =>
      !!pdf
        ? log("PDF document loaded %s", docId)
        : log(
            "loading PDF document %s: %s",
            docId,
            total || loaded ? (total / loaded) * 100 : 0
          )
  );
