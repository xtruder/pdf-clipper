import { ScaledPageRect } from "../lib/pageRects";
import { HighlightColor } from "../highlights/types";

export interface PDFHighlightLocation {
  // bounding area box of highlight, is area over all highlight areas
  boundingRect: ScaledPageRect;

  // areas for higlight
  rects: ScaledPageRect[];

  // number of page where highlight is starting
  pageNumber: number;
}

/**type of pdf highlight */
export type PDFHighlightType = "text" | "area";

export interface PDFHighlightInfo {
  /**type of the highlight whether is text or area highlight */
  type: PDFHighlightType;

  /**color of the highlight */
  color: HighlightColor;

  /**location of pdf highlight */
  location: PDFHighlightLocation;

  /**lexographically sortable pdf highlight sequence */
  sequence: string;
}

export type PDFHighlightInfoWithKey = PDFHighlightInfo & {
  /**unique highlight key */
  key: string;
};

export interface TextPDFHighlight extends PDFHighlightInfo {
  type: "text";
  text: string;
}

export interface AreaPDFHighlight extends PDFHighlightInfo {
  type: "area";
  image: Blob;
}

export type PDFHighlight = TextPDFHighlight | AreaPDFHighlight;

export type PDFHighlightWithKey = PDFHighlight & {
  /**unique highlight key */
  key: string;
};

export { HighlightColor } from "../highlights/types";
