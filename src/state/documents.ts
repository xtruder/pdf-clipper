import { AtomEffect, atomFamily, DefaultValue, selectorFamily } from "recoil";

import { debug as _debug } from "debug";

import {
  DocumentInfo,
  DocumentReadingInfo,
  DocumentType,
  Highlight,
  PDFHighlight,
} from "~/models";

import { pdfDocumentMeta, pdfPageAreaImage } from "./pdf";
import { resourceEffect } from "./effects";
import { persistence } from "./state";

const debug = _debug("state:documents");

/**Document info atom keyed by documentId */
export const documentInfo = atomFamily<DocumentInfo, string>({
  key: "documentInfo",
  default: (docId) => ({
    id: docId,
  }),
  effects: (docId) => [
    resourceEffect(persistence.documentInfo(docId)),
    getDocumentInfoEffect,
  ],
});

/**Reading information for document */
export const documentReadingInfo = atomFamily<
  DocumentReadingInfo,
  [string, string]
>({
  key: "documentReadingInfo",
  default: ([accountId, docId]) => ({ accountId, docId }),
  effects: ([accountId, docId]) => [
    resourceEffect(persistence.readingInfo(accountId, docId)),
  ],
});

/**Atom for highlight associated with document */
export const documentHighlights = atomFamily<Highlight[], string>({
  key: "documentHighlights",
  default: [],
  effects: (docId) => [resourceEffect(persistence.documentHighlights(docId))],
});

/**Selector that filters single document highlight */
export const documentHighlight = selectorFamily<
  Highlight,
  [docId: string, highlightId: string]
>({
  key: "documentHighlight",
  get:
    ([docId, highlightId]) =>
    ({ get }) => {
      const highlights = get(documentHighlights(docId));

      const highlight = highlights.find((h) => h.id === highlightId);

      if (!highlight)
        throw new Error("no highlight found with id: " + highlightId);

      return highlight;
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
      ([docId, highlightId, timestamp]) =>
      ({ get }) => {
        const { type, fileId } = get(documentInfo(docId));
        if (!fileId) throw new Error("missing document fileId");

        const highlight = get(documentHighlight([docId, highlightId]));

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

        persistence.highlightImage(docId, highlightId, timestamp).write(image);

        return image;
      },
  }),
  effects: ([docId, highlightId, timestamp]) => [
    resourceEffect(persistence.highlightImage(docId, highlightId, timestamp)),
  ],
});

/**Gets info about document by extracting it from file */
const getDocumentInfoEffect: AtomEffect<DocumentInfo> = ({
  node,
  getPromise,
  onSet,
  setSelf,
  trigger,
}) => {
  const getDocumentInfo = async () => {
    let { fileId, type, title, author, pageCount, outline, cover } =
      await getPromise(node);

    if (pageCount || outline || cover) return;

    debug("updating doc info");

    if (!fileId || !type) return;

    if (type === DocumentType.PDF) {
      const pdfMeta = await getPromise(pdfDocumentMeta(fileId));

      setSelf((val) => ({
        ...(val as DocumentInfo),
        title: title || pdfMeta.title,
        author: author || pdfMeta.author,
        pageCount: pageCount || pdfMeta.pageCount,
        outline: outline || pdfMeta.outline,
        cover: cover || pdfMeta.firstPage,
      }));
    }
  };

  if (trigger === "get") {
    getDocumentInfo();
  }

  onSet((newValue, oldValue) => {
    if (oldValue instanceof DefaultValue) return;
    if (newValue.fileId === oldValue.fileId) return;
    getDocumentInfo();
  });
};
