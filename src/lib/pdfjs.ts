import {
  PDFDocumentProxy,
  PDFPageProxy,
  getDocument as getPDFDocument,
} from "pdfjs-dist";
import { TypedArray } from "pdfjs-dist/types/src/display/api";
import { debug as _debug } from "debug";

import { DocumentOutline, OutlineNode } from "~/models";
import {
  asElement,
  getCanvasAreaAsPNG,
  isHTMLElement,
  getDocument,
  Rect,
} from "./dom";

const debug = _debug("pdfjs");

export interface PageView {
  viewport: Viewport;
  canvas: HTMLCanvasElement;
  textLayer?: {
    textLayerDiv: HTMLDivElement;
  };
  div: HTMLDivElement;
}

export interface Viewport {
  convertToPdfPoint: (x: number, y: number) => Array<number>;
  convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
  width: number;
  height: number;
}

export interface PageElement {
  number: number;
  node: HTMLElement;
}

export function getPageFromElement(target: HTMLElement): PageElement | null {
  const node = asElement(target.closest(".page"));

  if (!node || !isHTMLElement(node)) {
    return null;
  }

  const number = Number(asElement(node).dataset.pageNumber);

  return { node, number };
}

export function getPagesFromRange(range: Range): PageElement[] {
  const startParentElement = range.startContainer.parentElement;
  const endParentElement = range.endContainer.parentElement;

  if (!isHTMLElement(startParentElement) || !isHTMLElement(endParentElement)) {
    return [];
  }

  const startPage = getPageFromElement(asElement(startParentElement));
  const endPage = getPageFromElement(asElement(endParentElement));

  if (!startPage?.number || !endPage?.number) {
    return [];
  }

  if (startPage.number === endPage.number) {
    return [startPage];
  }

  if (startPage.number === endPage.number - 1) {
    return [startPage, endPage];
  }

  const pages: PageElement[] = [];

  let currentPageNumber = startPage.number;

  const document = startPage.node.ownerDocument;

  while (currentPageNumber <= endPage.number) {
    const currentPage = getPageFromElement(
      document.querySelector(
        `[data-page-number='${currentPageNumber}'`
      ) as HTMLElement
    );
    if (currentPage) {
      pages.push(currentPage);
    }
  }

  return pages;
}

// find existing container div, or creates a new container div
export function findOrCreateContainerLayer<T = Element>(
  container: HTMLElement,
  className: string
): T | null {
  const doc = getDocument(container);
  let layer = container.querySelector(`.${className}`);

  if (!layer) {
    layer = doc.createElement("div");
    layer.className = className;
    container.appendChild(layer);
  }

  return layer as unknown as T | null;
}

// gets pdf page height by providing page width
export function getPageHeight(page: PDFPageProxy, width: number): number {
  const viewport = page.getViewport({ scale: 1 });

  const scale = width / viewport.width;
  const height = viewport.height * scale;

  return height;
}

// creates screenshot of a page with selected width by rendering page in canvas
// and converting canvas to png image
export async function screenshotPageArea(
  page: PDFPageProxy,
  {
    width,
    scale = 1,
    area,
  }: {
    width?: number;
    scale?: number;
    area?: Rect;
  }
): Promise<string> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");

  canvas.width = width || viewport.width;

  const ratio = canvas.width / viewport.width;
  canvas.height = viewport.height * ratio;

  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) throw new Error("error getting canvas context");

  await page.render({
    canvasContext,
    viewport: page.getViewport({ scale: scale * ratio }),
  }).promise;

  return getCanvasAreaAsPNG(canvas, area);
}

type __OutlineNode = Awaited<
  ReturnType<PDFDocumentProxy["getOutline"]>
>[number];
export type _OutlineNode = Omit<__OutlineNode, "items"> & {
  items: _OutlineNode[];
  pageNumber?: number;
  top?: number;
};

export async function getDocumentOutline(
  document: PDFDocumentProxy
): Promise<DocumentOutline> {
  const outline: _OutlineNode[] = await document.getOutline();

  const mapOutlineNodes = async (
    nodes: _OutlineNode[]
  ): Promise<OutlineNode[]> =>
    await Promise.all(
      nodes.map(async (node) => {
        const items = await mapOutlineNodes(node.items);

        if (!node.dest) return { ...node, items };

        let dest: any[] | null =
          typeof node.dest === "string"
            ? await document.getDestination(node.dest)
            : node.dest;

        if (!dest) return { ...node, items };

        const ref = dest[0];
        const id = await document.getPageIndex(ref);

        return {
          title: node.title,
          items,
          location: dest,
          pageNumber: id + 1,
          top: dest[2],
        };
      })
    );

  if (!outline) return { items: [] };

  return { items: await mapOutlineNodes(outline) };
}

export const loadPDF = async (
  source: string | TypedArray,
  onProgress: (progress: number) => void = () => null
) => {
  debug("loading pdf", source);

  const loadingTask = getPDFDocument({
    ...(typeof source === "string" && { url: source }),
    ...(typeof source !== "string" && { data: source }),
    cMapUrl: new URL("/public/cmaps", window.location.toString()).href,
    cMapPacked: true,
  });

  loadingTask.onProgress = (args: { loaded: number; total: number }) => {
    onProgress(args.loaded / args.total);
  };

  const pdf = await loadingTask.promise;

  debug("pdf loaded", pdf._pdfInfo);

  return pdf;
};
