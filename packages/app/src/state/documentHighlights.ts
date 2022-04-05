import { atomFamily, selectorFamily, waitForAll } from "recoil";

import { DocumentType, DocumentHighlight, PDFHighlight } from "~/types";
import { notEmpty } from "~/lib/utils";

import { pdfPageAreaImage } from "./pdf";
import { resourceEffect } from "./effects";
import { persistence } from "./persistence";
import { documentInfo } from "./documentInfo";

/**Atom for highlight associated with document */
export const documentHighlight = atomFamily<
  DocumentHighlight | null,
  [docId: string, highlightId: string]
>({
  key: "documentHighlight",
  default: null,
  effects: ([docId, highlightId]) => [
    resourceEffect(persistence.documentHighlight(docId, highlightId)),
  ],
});

/**Atom keeping ids of highlights per document */
export const documentHighlightIds = atomFamily<string[], string>({
  key: "documentHighlightIds",
  default: [],
  effects: (docId: string) => [
    resourceEffect(persistence.documentHighlightIds(docId)),
  ],
});

/**Selector that filters single document highlight */
export const documentHighlights = selectorFamily<DocumentHighlight[], string>({
  key: "documentHighlights",
  get:
    (docId) =>
    ({ get }) => {
      const highlightIds = get(documentHighlightIds(docId));

      const highlights = get(
        waitForAll(highlightIds.map((id) => documentHighlight([docId, id])))
      );

      return highlights.filter(notEmpty);
    },
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
        const { type, fileId } = get(documentInfo(docId));
        if (!fileId) throw new Error("missing document fileId");

        const highlight = get(documentHighlight([docId, highlightId]));
        if (!highlight) throw new Error("missing highlight: " + highlightId);

        let image: string;
        if (type === DocumentType.PDF) {
          const pdfHighlight: PDFHighlight = highlight;

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
