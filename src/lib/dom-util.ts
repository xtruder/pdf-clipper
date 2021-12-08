import { LTWH } from "~/types";

// gets canvas area as png data url
export const getCanvasAreaAsPNG = (
  canvas: HTMLCanvasElement,
  { left, top, width, height }: LTWH
): string => {
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
