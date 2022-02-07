// Point defines a point in 2D space
export interface Point {
  x: number;
  y: number;
}
// Offset defines offset from top left

export interface Offset {
  left: number;
  top: number;
}
// Size defines width x height of something

export interface Size {
  width: number;
  height: number;
}
// Rect defined rectangle as left, top, width and height

export interface Rect extends Offset, Size {}

export const getDocument = (elm: any): Document =>
  (elm || {}).ownerDocument || document;
export const getWindow = (elm: any): typeof window =>
  (getDocument(elm) || {}).defaultView || window;
export const isHTMLElement = (elm: any) =>
  elm instanceof HTMLElement || elm instanceof getWindow(elm).HTMLElement;
export const isHTMLCanvasElement = (elm: any) =>
  elm instanceof HTMLCanvasElement ||
  elm instanceof getWindow(elm).HTMLCanvasElement;

export const asElement = (x: any): HTMLElement => x;

// gets canvas area as png data url
export const getCanvasAreaAsPNG = (
  canvas: HTMLCanvasElement,
  rect?: Rect
): string => {
  // if no rect provided, capture whole canvas area as image/png
  if (!rect) {
    return canvas.toDataURL("image/png");
  }

  const { left, top, width, height } = rect;
  const doc = canvas.ownerDocument;

  // creates a new canvas to draw image to
  const imgCanvas = doc.createElement("canvas");
  imgCanvas.width = width;
  imgCanvas.height = height;

  const imgCanvasContext = imgCanvas.getContext("2d");
  if (!imgCanvasContext) return "";

  // draws image to convas on area from existing canvas image source
  imgCanvasContext.drawImage(
    canvas,
    left * window.devicePixelRatio,
    top * window.devicePixelRatio,
    width * window.devicePixelRatio,
    height * window.devicePixelRatio,
    0,
    0,
    width,
    height
  );

  // return image as png data url
  return imgCanvas.toDataURL("image/png");
};

export const clearRangeSelection = () => {
  if (window.getSelection()?.empty) {
    // Chrome
    window.getSelection()?.empty();
  } else if (window.getSelection()?.removeAllRanges) {
    // Firefox
    window.getSelection()?.removeAllRanges();
  }
};

// gets bounding rect between two points
export const getBoundingRect = (start: Point, end: Point): Rect => {
  return {
    left: Math.min(end.x, start.x),
    top: Math.min(end.y, start.y),

    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
};

export const isDOMRectInside = (rect1: DOMRect, rect2: DOMRect) => {
  if (rect1.top < rect2.top) {
    return false;
  }
  if (rect1.bottom > rect2.bottom) {
    return false;
  }
  if (rect1.right > rect2.right) {
    return false;
  }
  if (rect1.left < rect2.left) {
    return false;
  }

  return true;
};

export const stripHtml = (html: string): string => {
  let div = document.createElement("DIV");
  div.innerHTML = html;
  console.log(div.textContent);
  return div.textContent || div.innerText || "";
};
