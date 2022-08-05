import debug from "debug";
import { from, mergeMap } from "rxjs";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PDFHighlight } from "@pdf-clipper/components";

import { PDFLoader } from "./PDFLoader";
import { Database } from "~/persistence/rxdb";

import { scaledRectToViewportRect } from "~/lib/pdf";
import { getPageCanvasArea } from "~/lib/pdfjs";
import { canvasToPNGBlob } from "~/lib/dom";

import { DocumentHighlightDocument } from "~/persistence/rxdb";
import { BlobStore } from "~/persistence/blobstore";

const log = debug("services:PDFHighlightScreenshotter");

export function createPDFHighlightScreenshotter(
  db: Database,
  pdfLoader: PDFLoader,
  blobStore: BlobStore
) {
  const docHighlights$ = db.documenthighlights
    .find({
      selector: {
        $and: [
          // all highlights that are for pdf documents
          { documentType: { $eq: "PDF" } },

          {
            $or: [
              // that don't have image associated
              { imageHash: { $exists: false } },

              // or image is null, which means it was reset
              { imageHash: { $eq: null } },
            ],
          },
        ],
      },
    })
    .$.pipe(mergeMap((documents) => documents));

  const pdfDocFromHighlight = (highlight: DocumentHighlightDocument) =>
    from(highlight.populateDocument()).pipe(
      mergeMap((document) => pdfLoader.getLoadedPDF(document.id))
    );

  const screenshotHighlight = async (
    highlight: DocumentHighlightDocument,
    pdfDocument: PDFDocumentProxy
  ) => {
    log("new highlight to screenshot %s", highlight.id);

    const pdfHighlight = highlight as PDFHighlight;

    const page = await pdfDocument.getPage(
      pdfHighlight.location.boundingRect.pageNumber
    );

    const viewport = page.getViewport({ scale: 5 });

    const area = scaledRectToViewportRect(
      pdfHighlight.location.boundingRect,
      viewport
    );

    const screenshot = await canvasToPNGBlob(
      await getPageCanvasArea(page, { scale: 5, area })
    );

    log(
      "saving screenshot for highlight %s, size: %s",
      highlight.id,
      screenshot.size
    );

    // save screehoted image
    const { hash } = await blobStore.store("highlightimg", screenshot);

    log("highlight screenshot saved %s with hash %s", highlight.id, hash);

    await highlight.atomicPatch({ imageHash: hash });

    return { highlight: pdfHighlight, screenshot };
  };

  const screenshotter$ = docHighlights$.pipe(
    mergeMap((highlight) =>
      pdfDocFromHighlight(highlight).pipe(
        mergeMap((pdfDoc) => screenshotHighlight(highlight, pdfDoc))
      )
    )
  );

  const start = () => screenshotter$.subscribe();

  return { start };
}
