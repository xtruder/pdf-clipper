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

import { Database } from "../persistence/rxdb";
import { DocumentDocument } from "../persistence/collections/document";

const log = debug("services:PDFloader");

export interface PDFLoadStatus {
  pdf: PDFDocumentProxy | null;
  progress: PDFLoadProgress;
}

export interface PDFDocumentLoadable {
  documentId: string;
  loader: Observable<PDFLoadStatus>;
}

export interface PDFLoader {
  /**PDF document loader observable */
  loader$: Observable<PDFDocumentLoadable>;

  /**gets pdf observable with loading status */
  getPDF: (id: string) => Observable<PDFLoadStatus>;

  getLoadedPDF: (id: string) => Observable<PDFDocumentProxy>;
}

export function createPDFLoader(db: Database): PDFLoader {
  // find PDF documents
  const pdfDocs$ = db.documents
    .find({
      selector: {
        $and: [
          // type is PDF
          { type: { $eq: "PDF" } },

          // and have file attached
          { file: { $exists: true } },
        ],
      },
    })
    .$.pipe(mergeMap((doc) => doc));

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

const getDocumentSource = async (pdfDoc: DocumentDocument) => {
  const file = await pdfDoc.getCachedFile();

  const source = file ? file : pdfDoc.file!.source!;

  return source;
};

/**function that loads PDF and reports loading progress */
const loadPDFWithProgress = (
  source: File | string
): Observable<PDFLoadStatus> => {
  const subject$ = new BehaviorSubject<PDFLoadStatus>({
    pdf: null,
    progress: {
      loaded: 0,
      total: 0,
    },
  });

  loadPDF(source, (progress) => subject$.next({ pdf: null, progress }))
    .then((pdf) =>
      subject$.next({
        pdf,
        progress: {
          total: subject$.value.progress.total,
          loaded: subject$.value.progress.total,
        },
      })
    )
    .catch((err) => subject$.error(err));

  return subject$;
};

const logProgress = (docId: string) =>
  tap(({ progress: { loaded, total }, pdf }: PDFLoadStatus) =>
    !!pdf
      ? log("PDF document loaded %s", docId)
      : log(
          "loading PDF document %s: %s",
          docId,
          total || loaded ? (total / loaded) * 100 : 0
        )
  );

/**operator that creates observable for loading pdfs  */
const createLoadablePDFDocument = (pdfDoc: DocumentDocument) =>
  of(pdfDoc).pipe(
    // get source of the document
    mergeMap(getDocumentSource),
    map((source) =>
      of(source).pipe(
        mergeMap(loadPDFWithProgress),
        logProgress(pdfDoc.id),
        shareReplay({ bufferSize: 1, refCount: false })
      )
    ),

    // add documentId to loader
    mergeMap((loader) => of({ documentId: pdfDoc.id, loader }))
  );
