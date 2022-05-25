import { atomFamily, selectorFamily } from "recoil";

import { DocumentHighlight, PDFHighlight } from "~/types";

import { pdfPageAreaImage } from "./pdf";
import { graphqlEffect } from "./effects";
import { api } from "~/api";
import { fileInfo } from "./fileInfo";
import { document } from "./document";

/**Atom for a list of document highlights associated with document */
export const documentHighlights = atomFamily<
  {
    id: string;
    updatedAt: Date;
  }[],
  string
>({
  key: "documentHighlights",
  default: [],
  effects: (documentId) => [
    graphqlEffect({
      get: () => api.getDocumentHighlights(documentId),
      subscribe: () => api.subscribeHighlights(documentId),
    }),
  ],
});

/**Atom for document highlight items, keyed by highlightId and updatedAt time */
export const documentHighlight = atomFamily<DocumentHighlight, string>({
  key: "documentHighlight",
  default: (id) => ({ id, createdAt: new Date(), updatedAt: new Date() }),
  effects: (id) => [
    graphqlEffect<DocumentHighlight>({
      get: () => api.getDocumentHighlight(id),
      write: async (newValue) =>
        newValue && api.upsertDocumentHighlight(newValue),
    }),
  ],
});

/**Selector that filters single document highlight */
// export const documentHighlights = selectorFamily<DocumentHighlight[], string>({
//   key: "documentHighlights",
//   get:
//     (docId) =>
//     ({ get }) => {
//       const highlightIds = get(documentHighlightIds(docId));

//       const highlights = get(
//         waitForAll(highlightIds.map((id) => documentHighlight([docId, id])))
//       );

//       return highlights.filter(notEmpty);
//     },
// });

/**gets highlight image associated with document and highlight with timestamp */
export const documentHighlightImage = atomFamily<
  string | null,
  [highlightId: string, updatedAt: number]
>({
  key: "documentHighlightImage",
  default: selectorFamily<
    string | null,
    [highlightId: string, updatedAt: number]
  >({
    key: "documentHighlightImage/default",
    get:
      ([highlightId, _updatedAt]) =>
      ({ get }) => {
        // get information about highlight
        const { documentId, ...highlight } = get(
          documentHighlight(highlightId)
        );

        // if no documentId has be defined there is nothing to extract highlight
        // image from
        if (!documentId) return null;

        // get information about document
        const doc = get(document(documentId));

        let image: string;
        if (doc.type === "pdf") {
          const pdfHighlight: PDFHighlight = highlight;

          // if no location has been defined yet, we don't have information
          // where to extract highlight image
          if (!pdfHighlight.location) return null;

          image = get(
            pdfPageAreaImage([
              documentId,
              pdfHighlight.location.boundingRect,
              5,
            ])
          );
        } else {
          throw new Error("invalid document type: " + doc.type);
        }

        if (!image)
          throw new Error(
            `error getting highlight image for ${documentId}/${highlightId}`
          );

        return image;
      },
  }),
});
