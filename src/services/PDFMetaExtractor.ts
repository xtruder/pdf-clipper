import { mergeMap, tap, distinct, forkJoin, of } from "rxjs";
import debug from "debug";

import { getPageCanvasArea, getDocumentOutline } from "~/lib/pdfjs";

import { PDFLoader } from "./PDFLoader";
import { Database } from "../persistence/rxdb";

import { DocumentDocument } from "../persistence/collections/document";
import { canvasToPNGDataURI } from "~/lib/dom";
import { PDFDocumentProxy } from "pdfjs-dist";

const log = debug("services:PDFMetaExtractor");

export function createPDFMetaExtractor(db: Database, pdfLoader: PDFLoader) {
  const pdfDocsWithoutMeta$ = db.documents
    .find({
      selector: {
        $and: [
          // all pdf files
          { type: { $eq: "PDF" } },

          // that have file associated
          { file: { $exists: true } },

          // and that don't have meta extracted yet
          { "meta.pageCount": { $exists: false } },
        ],
      },
    })
    .$.pipe(mergeMap((doc) => doc));

  const getPDFDocMeta = async (
    document: DocumentDocument,
    pdfDocument: PDFDocumentProxy
  ) => {
    // get pdf document metadata
    const { info }: { info: any } = await pdfDocument.getMetadata();

    // get first page and screenshot page as cover
    const page1 = await pdfDocument.getPage(1);
    const cover = canvasToPNGDataURI(
      await getPageCanvasArea(page1, { width: 600 })
    );

    // get pdf document outline
    const outline = await getDocumentOutline(pdfDocument);

    return await document.atomicPatch({
      meta: {
        ...document.meta,
        pageCount: pdfDocument.numPages,
        title: info["Title"],
        author: info["Author"],
        cover,
        outline,
      },
    });
  };

  const pdfDocsWithMeta$ = pdfDocsWithoutMeta$.pipe(
    // extract each document exactly once
    distinct((document) => document.id),

    tap((document) => log("extracting pdf meta from document", document.id)),

    mergeMap((document) =>
      forkJoin({
        document: of(document),
        pdf: pdfLoader.getLoadedPDF(document.id),
      })
    ),

    mergeMap(({ document, pdf }) => getPDFDocMeta(document, pdf)),

    tap(
      (document) => document && log("pdf document meta extracted", document.id)
    )
  );

  const start = () => pdfDocsWithMeta$.subscribe();

  return { start };
}
