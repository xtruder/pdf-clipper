import { atomFamily, selectorFamily } from "recoil";

import { DocumentType, DocumentHighlight, PDFHighlight } from "~/types";

import { pdfPageAreaImage } from "./pdf";
import { rxDocumentEffect, rxQueryEffect } from "./effects";
import { currentAccountId, db } from "./persistence";
import { documentInfo } from "./documentInfo";

/**Atom for highlight associated with document */
export const documentHighlight = atomFamily<
  DocumentHighlight,
  [documentId: string, highlightId: string]
>({
  key: "documentHighlight",
  default: ([documentId, id]) => ({
    id,
    documentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: null,
    content: null,
    createdBy: currentAccountId,
  }),
  effects: ([documentId, id]) => [
    rxDocumentEffect(db.document_highlight, `${documentId}|${id}`),
  ],
});

/**Atom keeping all highlights for particular document */
export const documentHighlights = atomFamily<DocumentHighlight[], string>({
  key: "documentHighlights",
  default: [],
  effects: (documentId: string) => [
    rxQueryEffect(db.document_highlight.find().where({ documentId })),
  ],
});

export const documentHighlightImage = atomFamily<
  string,
  [docId: string, highlightId: string, timestamp: number]
>({
  key: "documentHighlightImage",
  default: selectorFamily({
    key: "documentHighlightImage/default",
    get:
      ([docId, highlightId, _timestamp]) =>
      ({ get }) => {
        const docInfo = get(documentInfo(docId));
        if (!docInfo) throw new Error("missing document: " + docId);

        const { type, fileHash: fileId } = docInfo;
        if (!fileId) throw new Error("missing document fileId");

        const highlight = get(documentHighlight([docId, highlightId]));
        if (!highlight) throw new Error("missing highlight: " + highlightId);

        let image: string;
        if (type === DocumentType.PDF) {
          const pdfHighlight: PDFHighlight = highlight;

          if (!pdfHighlight.location)
            throw new Error("missing highlight location");

          image = get(
            pdfPageAreaImage([fileId, pdfHighlight.location.boundingRect, 5])
          );
        } else {
          throw new Error("invalid document type: " + type);
        }

        if (!image)
          throw new Error(
            `error getting highlight image for ${docId}/${highlightId}`
          );

        return image;
      },
  }),
});
