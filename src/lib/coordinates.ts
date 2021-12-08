import {
  Rect,
  PageRect,
  PageElement,
  Point,
  Viewport,
  ScaledRect,
  ScaledPageRect,
} from "~/types";

const pdfToViewport = (rect: Rect, viewport: Viewport): Rect => {
  const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([
    rect.left,
    rect.top,
    rect.left + rect.width,
    rect.top + rect.height,
  ]);

  return {
    left: x1,
    top: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
};

export const scaledRectToViewportRect = (
  rect: ScaledRect,
  viewport: Viewport,
  usePdfCoordinates: boolean = false
): Rect => {
  if (usePdfCoordinates) {
    return pdfToViewport(rect, viewport);
  }

  const factorX = viewport.width / rect.scaleX;
  const factorY = viewport.height / rect.scaleY;

  return {
    left: rect.left * factorX,
    top: rect.top * factorY,
    width: rect.width * factorX,
    height: rect.height * factorY,
  };
};

export const viewportRectToScaledPageRect = (
  pageRect: PageRect,
  viewport: Viewport
): ScaledPageRect => ({
  left: pageRect.left,
  top: pageRect.top,
  width: pageRect.width,
  height: pageRect.height,
  scaleX: viewport.width,
  scaleY: viewport.height,
  pageNumber: pageRect.pageNumber,
});

export const getBoundingRect = (start: Point, end: Point): Rect => {
  return {
    left: Math.min(end.x, start.x),
    top: Math.min(end.y, start.y),

    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
};

const isClientRectInsidePageRect = (clientRect: DOMRect, pageRect: DOMRect) => {
  if (clientRect.top < pageRect.top) {
    return false;
  }
  if (clientRect.bottom > pageRect.bottom) {
    return false;
  }
  if (clientRect.right > pageRect.right) {
    return false;
  }
  if (clientRect.left < pageRect.left) {
    return false;
  }

  return true;
};

// gets highlighted client rects that are within page
export const getHighlightedRectsWithinPages = (
  // highlighted range
  range: Range,

  // pages to check
  pages: PageElement[],
  shouldOptimize: boolean = true
): PageRect[] => {
  const clientRects = Array.from(range.getClientRects());

  const rects: PageRect[] = [];

  for (const clientRect of clientRects) {
    for (const page of pages) {
      const pageRect = page.node.getBoundingClientRect();

      if (
        isClientRectInsidePageRect(clientRect, pageRect) &&
        clientRect.top >= 0 &&
        clientRect.bottom >= 0 &&
        clientRect.width > 0 &&
        clientRect.height > 0 &&
        clientRect.width < pageRect.width &&
        clientRect.height < pageRect.height
      ) {
        const highlightedRect: PageRect = {
          top: clientRect.top + page.node.scrollTop - pageRect.top,
          left: clientRect.left + page.node.scrollLeft - pageRect.left,
          width: clientRect.width,
          height: clientRect.height,
          pageNumber: page.number,
        };

        rects.push(highlightedRect);
      }
    }
  }

  return shouldOptimize ? optimizeClientRects(rects) : rects;
};

export const getBoundingRectForRects = (clientRects: PageRect[]): PageRect => {
  const rects = clientRects.map((rect) => {
    const { left, top, width, height, pageNumber } = rect;

    const X0 = left;
    const X1 = left + width;

    const Y0 = top;
    const Y1 = top + height;

    return { X0, X1, Y0, Y1, pageNumber };
  });

  let firstPageNumber = Number.MAX_SAFE_INTEGER;

  rects.forEach((rect) => {
    firstPageNumber = Math.min(
      firstPageNumber,
      rect.pageNumber ?? firstPageNumber
    );
  });

  const rectsWithSizeOnFirstPage = rects.filter(
    (rect) =>
      (rect.X0 > 0 || rect.X1 > 0 || rect.Y0 > 0 || rect.Y1 > 0) &&
      rect.pageNumber === firstPageNumber
  );

  const optimal = rectsWithSizeOnFirstPage.reduce((res, rect) => {
    return {
      X0: Math.min(res.X0, rect.X0),
      X1: Math.max(res.X1, rect.X1),

      Y0: Math.min(res.Y0, rect.Y0),
      Y1: Math.max(res.Y1, rect.Y1),

      pageNumber: firstPageNumber,
    };
  }, rectsWithSizeOnFirstPage[0]);

  const { X0, X1, Y0, Y1, pageNumber } = optimal;

  return {
    left: X0,
    top: Y0,
    width: X1 - X0,
    height: Y1 - Y0,
    pageNumber,
  };
};
