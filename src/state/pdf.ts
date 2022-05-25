import { AtomEffect, selectorFamily } from "recoil";

import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { debug as _debug } from "debug";

import { ScaledPageRect, scaledRectToViewportRect } from "~/lib/pdf";
import { getDocumentOutline, loadPDF, screenshotPageArea } from "~/lib/pdfjs";
import { TypedArray } from "~/lib/nativefs";

import { DocumentInfo, PDFDocumentMeta } from "~/types";

import { paths } from "./const";
import { fs } from "./persistence";
import { fileInfo } from "./fileInfo";

const debug = _debug("state:pdf");

export interface PDFDocumentLoader {
  progress: number;
  documentPromise: Promise<PDFDocumentProxy>;
}

export const pdfDocumentProxy = selectorFamily<PDFDocumentProxy, string>({
  key: "pdfDocument",

  // PDFDocumentProxy is a class that needs to be mutable
  dangerouslyAllowMutability: true,

  get:
    (fileId) =>
    async ({ get }) => {
      const path = paths.file(fileId, "pdf");

      const info = get(fileInfo(fileId));

      // try to load local file, if it does not exist load from actual source
      let source: string | TypedArray;
      try {
        const file = await fs.getFile(path);
        source = new Uint8Array(await file.arrayBuffer());
      } catch (err: any) {
        if (err.name !== "NotFoundError") throw err;

        // TODO: implement better logic for getting and loading right source
        source = info.sources[0];
      }

      const pdf = await loadPDF(source);

      // save pdf document locally
      const pdfData = await pdf.getData();
      await fs.saveFile(path, pdfData);

      return pdf;
    },
});

export const pdfDocumentMeta = selectorFamily<PDFDocumentMeta, string>({
  key: "pdfDocumentMeta",
  get:
    (fileId) =>
    async ({ get }) => {
      debug("getting document meta");

      const pdfDoc = get(pdfDocumentProxy(fileId));

      const outline = await getDocumentOutline(pdfDoc);

      const meta = await pdfDoc.getMetadata();
      const info = meta.info as any;

      const page1 = await pdfDoc.getPage(1);

      const firstPage = await screenshotPageArea(page1, { width: 600 });

      const pdfMeta = {
        pageCount: pdfDoc.numPages,
        title: info["Title"],
        author: info["Author"],
        firstPage,
        outline,
      };

      debug("document meta", pdfMeta);

      return pdfMeta;
    },
});

export const pdfPage = selectorFamily<PDFPageProxy, [string, number]>({
  key: "pdfPage",
  dangerouslyAllowMutability: true,
  get:
    ([fileId, pageNumber]) =>
    async ({ get }) => {
      const pdfDoc = get(pdfDocumentProxy(fileId));

      return await pdfDoc.getPage(pageNumber + 1);
    },
});

export const pdfPages = selectorFamily<PDFPageProxy[], string>({
  key: "pdfPages",
  dangerouslyAllowMutability: true,
  get:
    (fileId) =>
    async ({ get }) => {
      const pdfDoc = get(pdfDocumentProxy(fileId));

      const pagesNumbers = Array.from(Array(pdfDoc.numPages).keys());

      return Promise.all(pagesNumbers.map((i) => pdfDoc.getPage(i + 1)));
    },
});

export const pdfPageThumbnail = selectorFamily<
  string,
  [fileId: string, pageNumber: number]
>({
  key: "pdfPageThumbnail",
  dangerouslyAllowMutability: true,
  get:
    ([fileId, pageNumber]) =>
    async ({ get }) => {
      const pdfDoc = get(pdfDocumentProxy(fileId));

      const page = await pdfDoc.getPage(pageNumber);

      const screen = await screenshotPageArea(page, { width: 300 });

      return screen;
    },
});

/**Selector to get area of pdf page */
export const pdfPageAreaImage = selectorFamily<
  string,
  [fileId: string, rect: Readonly<ScaledPageRect>, scale?: number]
>({
  key: "pdfPageArea",
  get:
    ([fileId, rect, scale = 5]) =>
    async ({ get }) => {
      const pdfDoc = get(pdfDocumentProxy(fileId));

      const page = await pdfDoc.getPage(rect.pageNumber);

      const viewport = page.getViewport({ scale });

      const area = scaledRectToViewportRect(rect, viewport);

      return await screenshotPageArea(page, { scale, area });
    },
});

export const extractPDFMetaEffect: (
  docId: string
) => AtomEffect<DocumentInfo> =
  (docId) =>
  ({ node, trigger, getPromise, setSelf, onSet }) => {
    const updateDocInfo = async () => {
      const docInfo = await getPromise(node);
      if (docInfo.outline) return;

      const { outline, author, title, firstPage, pageCount } = await getPromise(
        pdfDocumentMeta(docId)
      );

      setSelf({
        ...docInfo,
        outline,
        pageCount,
        cover: firstPage,
        title,
        author,
      });
    };

    if (trigger === "get") updateDocInfo();
    onSet(updateDocInfo);
  };
