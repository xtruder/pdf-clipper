import { PDFPageProxy } from "pdfjs-dist";
import { PageElement, PageView } from "~/types";

import {
  asElement,
  getCanvasAreaAsPNG,
  getDocument,
  isHTMLElement,
} from "./dom-utils";

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
export async function screenshotPage(
  page: PDFPageProxy,
  width: number
): Promise<string | null> {
  const viewport = page.getViewport({ scale: 1 });
  const canvas = document.createElement("canvas");

  canvas.width = width;

  const scale = width / viewport.width;
  canvas.height = viewport.height * scale;

  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) return null;

  await page.render({
    canvasContext,
    viewport: page.getViewport({ scale }),
  }).promise;

  return getCanvasAreaAsPNG(canvas);
}
