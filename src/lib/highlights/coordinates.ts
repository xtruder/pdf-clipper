import { PageRect, ScaledRect, ScaledPageRect } from "./types";

import { Rect, Point } from "~/lib/dom";
import { PageElement, Viewport } from "~/lib/pdfjs";

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
  rect: PageRect,
  viewport: Viewport
): ScaledPageRect => ({
  left: rect.left,
  top: rect.top,
  width: rect.width,
  height: rect.height,
  scaleX: viewport.width,
  scaleY: viewport.height,
  pageNumber: rect.pageNumber,
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

const sort = (rects: Array<PageRect>) =>
  rects.sort((A, B) => {
    const top = (A.pageNumber || 0) * A.top - (B.pageNumber || 0) * B.top;

    if (top === 0) {
      return A.left - B.left;
    }

    return top;
  });

const overlaps = (A: PageRect, B: PageRect) =>
  A.pageNumber === B.pageNumber &&
  A.left <= B.left &&
  B.left <= A.left + A.width;

const sameLine = (A: PageRect, B: PageRect, yMargin = 5) =>
  A.pageNumber === B.pageNumber &&
  Math.abs(A.top - B.top) < yMargin &&
  Math.abs(A.height - B.height) < yMargin;

const inside = (A: PageRect, B: PageRect) =>
  A.pageNumber === B.pageNumber &&
  A.top > B.top &&
  A.left > B.left &&
  A.top + A.height < B.top + B.height &&
  A.left + A.width < B.left + B.width;

const nextTo = (A: PageRect, B: PageRect, xMargin = 10) => {
  const Aright = A.left + A.width;
  const Bright = B.left + B.width;

  return (
    A.pageNumber === B.pageNumber &&
    A.left <= B.left &&
    Aright <= Bright &&
    B.left - Aright <= xMargin
  );
};

const extendWidth = (A: PageRect, B: PageRect) => {
  // extend width of A to cover B
  A.width = Math.max(B.width - A.left + B.left, A.width);
};

const optimizeClientRects = (clientRects: Array<PageRect>): Array<PageRect> => {
  const rects = sort(clientRects);

  const toRemove = new Set();

  const firstPass = rects.filter((rect) => {
    return rects.every((otherRect) => {
      return !inside(rect, otherRect);
    });
  });

  let passCount = 0;

  while (passCount <= 2) {
    firstPass.forEach((A) => {
      firstPass.forEach((B) => {
        if (A === B || toRemove.has(A) || toRemove.has(B)) {
          return;
        }

        if (!sameLine(A, B)) {
          return;
        }

        if (overlaps(A, B)) {
          extendWidth(A, B);
          A.height = Math.max(A.height, B.height);

          toRemove.add(B);
        }

        if (nextTo(A, B)) {
          extendWidth(A, B);

          toRemove.add(B);
        }
      });
    });
    passCount += 1;
  }

  return firstPass.filter((rect) => !toRemove.has(rect));
};
