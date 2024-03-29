import React from "react";

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
export const getCanvasArea = (
  canvas: HTMLCanvasElement,
  rect?: Rect,
  devicePixelRatio: number = 1
): HTMLCanvasElement => {
  // if no rect provided, capture whole canvas area as image/png
  if (!rect) {
    return canvas;
  }

  const { left, top, width, height } = rect;
  const doc = canvas.ownerDocument;

  // creates a new canvas to draw image to
  const imgCanvas = doc.createElement("canvas");
  imgCanvas.width = width;
  imgCanvas.height = height;

  const imgCanvasContext = imgCanvas.getContext("2d");
  if (!imgCanvasContext) throw new Error("can't create 2d canvas context");

  // draws image to convas on area from existing canvas image source
  imgCanvasContext.drawImage(
    canvas,
    left * devicePixelRatio,
    top * devicePixelRatio,
    width * devicePixelRatio,
    height * devicePixelRatio,
    0,
    0,
    width,
    height
  );

  return imgCanvas;
};

export const canvasToPNGBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("can't create canvas image"));
      resolve(blob);
    }, "image/png")
  );

export const canvasToPNGDataURI = (canvas: HTMLCanvasElement) =>
  canvas.toDataURL("image/png");

export const blobToDataURL = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

// gets bounding rect between two points
export const getBoundingRect = (start: Point, end: Point): Rect => {
  return {
    left: Math.min(end.x, start.x),
    top: Math.min(end.y, start.y),

    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
};

export const getRangeRects = (range: Range): Rect[] => {
  const clientRects = Array.from(range.getClientRects());

  return clientRects
    .map((rect) => ({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }))
    .filter(
      (rect) =>
        !(
          rect.left === 0 &&
          rect.top === 0 &&
          rect.width === 0 &&
          rect.height === 0
        )
    );
};

export const getBoundingRectForRects = (clientRects: Rect[]): Rect => {
  const rects = clientRects.map((rect) => {
    const { left, top, width, height } = rect;

    const X0 = left;
    const X1 = left + width;

    const Y0 = top;
    const Y1 = top + height;

    return { X0, X1, Y0, Y1 };
  });

  const optimal = rects.reduce((res, rect) => {
    return {
      X0: Math.min(res.X0, rect.X0),
      X1: Math.max(res.X1, rect.X1),

      Y0: Math.min(res.Y0, rect.Y0),
      Y1: Math.max(res.Y1, rect.Y1),
    };
  }, rects[0]);

  const { X0, X1, Y0, Y1 } = optimal;

  return {
    left: X0,
    top: Y0,
    width: X1 - X0,
    height: Y1 - Y0,
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
  const div = document.createElement("DIV");
  div.innerHTML = html;

  return div.textContent || div.innerText || "";
};

export const setEndOfContenteditable = (
  contentEditableElement: HTMLElement
) => {
  if (!document.createRange) return;

  //Firefox, Chrome, Opera, Safari, IE 9+
  const range = document.createRange(); //Create a range (a range is a like the selection but invisible)
  range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
  range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start

  const selection = window.getSelection(); //get the selection object (allows you to change selection)
  selection?.removeAllRanges(); //remove any selections already made
  selection?.addRange(range); //make the range you have just created the visible selection
};

export const copyPlainText = (e: React.ClipboardEvent) => {
  const selection = document.getSelection();
  if (!selection) return;

  const text = selection.toString().trimEnd();
  e.clipboardData.setData("text/plain", text);
  e.preventDefault();
};

export const cutPlainText = (e: React.ClipboardEvent) => {
  const selection = document.getSelection();
  if (!selection) return;

  e.clipboardData.setData("text/plain", selection.toString());
  selection.deleteFromDocument();
  e.preventDefault();
};

export const touchPoint = (event: MouseEvent | TouchEvent) => {
  if ("pageX" in event && "pageY" in event) {
    return { pageX: event.pageX, pageY: event.pageY };
  } else if ("changedTouches" in event && event["changedTouches"].length > 0) {
    const last = event.changedTouches.length - 1;
    return {
      pageX: event.changedTouches[last].pageX,
      pageY: event.changedTouches[last].pageY,
    };
  } else if ("touches" in event && event["touches"].length > 0) {
    return { pageX: event.touches[0].pageX, pageY: event.touches[0].pageY };
  }

  throw new Error("invalid event");
};

export const isEventNear = (
  ev1?: MouseEvent | TouchEvent,
  ev2?: MouseEvent | TouchEvent,
  {
    maxDelay = 250,
    maxDistance = 100,
  }: { maxDelay?: number; maxDistance?: number } = {}
): boolean => {
  if (!ev1 || !ev2) return false;

  if (Math.abs(ev1.timeStamp - ev2.timeStamp) > maxDelay) return false;

  const { pageX: x1, pageY: y1 } = touchPoint(ev1);
  const { pageX: x2, pageY: y2 } = touchPoint(ev1);

  if (Math.abs(x1 - x2) + Math.abs(y1 - y2) > maxDistance) return false;

  return true;
};
