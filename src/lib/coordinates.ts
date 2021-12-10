import { LTWH, PageArea, Viewport } from "~/types";

const pdfToViewport = (pageArea: PageArea, viewport: Viewport): LTWH => {
  const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([
    pageArea.leftTop.x,
    pageArea.leftTop.y,
    pageArea.rightBotton.x,
    pageArea.rightBotton.y,
  ]);

  return {
    left: x1,
    top: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
};

export const pageAreaToViewport = (
  pageArea: PageArea,
  viewport: Viewport,
  usePdfCoordinates: boolean = false
): LTWH => {
  const { width, height } = viewport;

  if (usePdfCoordinates) {
    return pdfToViewport(pageArea, viewport);
  }

  const x1 = (width * pageArea.leftTop.x) / pageArea.pageSize.width;
  const y1 = (height * pageArea.leftTop.y) / pageArea.pageSize.height;

  const x2 = (width * pageArea.rightBotton.x) / pageArea.pageSize.width;
  const y2 = (height * pageArea.rightBotton.y) / pageArea.pageSize.height;

  return {
    left: x1,
    top: x2,
    width: x2 - x1,
    height: y2 - y1,
  };
};
