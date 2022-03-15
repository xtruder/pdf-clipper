import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

import { getDocumentOutline, loadPDF, screenshotPageArea } from "~/lib/pdfjs";
import { s4 } from "~/lib/utils";
import {
  Account,
  DocumentInfo,
  DocumentReadingInfo,
  Highlight,
  DocumentType,
  DocumentSources,
  PDFDocumentMeta,
} from "~/models";

import { State } from "./state";
import { screenshotHighlight } from "./effects";

const docId = "100";

const getCurrentAccount = selector<Account>({
  key: "getCurrentAccount",
  get: async () => {
    return { id: s4(), documentIds: [docId] };
  },
});

export const currentAccount = atom<Account>({
  key: "currentAccount",
  default: getCurrentAccount,
});

export const documentSources = atomFamily<DocumentSources, string>({
  key: "documentSources",
  default: {
    id: docId,
    type: DocumentType.PDF,
    sources: ["https://arxiv.org/pdf/1708.08021.pdf"],
  },
});

export const documentHighlights = atomFamily<Highlight[], string>({
  key: "documentHighlights",
  default: [],
});

export const documentHighlightImage = atomFamily<
  string | undefined,
  [string, string]
>({
  key: "documentHighlightImage",
  default: undefined,
  effects: ([documentId, highlightId]) => [
    screenshotHighlight(documentId, highlightId),
  ],
});

export const getDocumentInfoDefault = selectorFamily<DocumentInfo, string>({
  key: "documentInfoDefault",
  get:
    (id) =>
    ({ get }) => {
      const { type, sources } = get(documentSources(id));

      return {
        id,
        type,
        url: sources[0],
        title: "",
      };
    },
});

export const documentInfo = atomFamily<DocumentInfo, string>({
  key: "documentInfo",
  default: getDocumentInfoDefault,
  effects: (id) => [
    ({ node, getPromise, setSelf, trigger }) => {
      if (trigger === "get") {
        setSelf(
          getPromise(node).then(async (docInfo) => {
            if ("__tag" in docInfo) return docInfo;
            if (docInfo.outline) return docInfo;

            const { outline, author, title, firstPage, pageCount } =
              await getPromise(pdfDocumentMeta(id));

            return {
              ...docInfo,
              outline,
              pageCount,
              cover: firstPage,
              title,
              author,
            };
          })
        );
      }
    },
  ],
});

export const documentReadingInfo = atomFamily<DocumentReadingInfo, string>({
  key: "documentReadingInfo",
  default: {},
});

const pdfDocumentLoader = atomFamily<
  {
    progress: number;
    document: Promise<PDFDocumentProxy>;
  },
  string
>({
  key: "pdfDocumentLoader",
  default: null as any,
  effects: (id) => [
    ({ setSelf, getPromise, trigger }) => {
      if (trigger === "get") {
        const document: Promise<PDFDocumentProxy> = getPromise(
          documentSources(id)
        ).then((sources) =>
          loadPDF(sources.sources[0], (progress) =>
            setSelf({ document, progress })
          )
        );

        setSelf({ document, progress: 0 });
      }
    },
  ],
});

export const pdfDocumentProxy = selectorFamily<PDFDocumentProxy, string>({
  key: "pdfDocument",
  dangerouslyAllowMutability: true,
  get:
    (id) =>
    async ({ get }) => {
      const pdfDocument = get(pdfDocumentLoader(id));

      return await pdfDocument.document;
    },
});

export const documentLoadProgress = selectorFamily<number, string>({
  key: "documentLoadProgress",
  get:
    (id) =>
    ({ get }) => {
      const sources = get(documentSources(id));

      if (sources.type === DocumentType.PDF) {
        return get(pdfDocumentLoader(id)).progress;
      }

      throw new Error("document source not supported");
    },
});

export const pdfDocumentMeta = selectorFamily<PDFDocumentMeta, string>({
  key: "pdfDocumentMeta",
  get:
    (id) =>
    async ({ get }) => {
      const pdfDocument = get(pdfDocumentProxy(id));

      const outline = await getDocumentOutline(pdfDocument);

      const meta = await pdfDocument.getMetadata();
      const info = meta.info as any;

      const page1 = await pdfDocument.getPage(1);

      const firstPage = await screenshotPageArea(page1, { width: 600 });

      return {
        pageCount: pdfDocument.numPages,
        title: info["Title"],
        author: info["Author"],
        firstPage,
        outline,
      };
    },
});

export const pdfPageThumbnail = selectorFamily<
  string | undefined,
  [string, number]
>({
  key: "pdfPageThumbnail",
  dangerouslyAllowMutability: true,
  get:
    ([documentId, pageNumber]) =>
    async ({ get }) => {
      const pdfDocument = get(pdfDocumentProxy(documentId));

      const page = await pdfDocument.getPage(pageNumber);

      const screen = await screenshotPageArea(page, { width: 300 });

      return screen;
    },
});

export const pdfPageProxy = selectorFamily<PDFPageProxy, [string, number]>({
  key: "pdfPageProxy",
  dangerouslyAllowMutability: true,
  get:
    ([documentId, pageNumber]) =>
    async ({ get }) => {
      const pdfDocument = get(pdfDocumentProxy(documentId));

      return await pdfDocument.getPage(pageNumber + 1);
    },
});

export const pdfDocumentPages = selectorFamily<PDFPageProxy[], string>({
  key: "pdfDocumentPages",
  dangerouslyAllowMutability: true,
  get:
    (id) =>
    async ({ get }) => {
      const pdfDocument = get(pdfDocumentProxy(id));

      const pagesNumbers = Array.from(Array(pdfDocument.numPages).keys());

      return Promise.all(pagesNumbers.map((i) => pdfDocument.getPage(i + 1)));
    },
});

export const localState: State = {
  currentAccount,
  documentSources,
  documentHighlights,
  documentHighlightImage,
  documentInfo,
  documentReadingInfo,
  pdfDocumentProxy,
  documentLoadProgress,
  pdfDocumentMeta,
  pdfPageThumbnail,
  pdfDocumentPages,
};
