import { Highlight, HighlightColor } from "./Highlight";

import { ScaledPageRect } from "~/lib/pdf";

// location of a highlight

export interface PDFHighlightLocation {
  // bounding area box of highlight, is area over all highlight areas
  boundingRect: ScaledPageRect;

  // areas for higlight
  rects: ScaledPageRect[];

  // number of page where highlight is starting
  pageNumber: number;
}

export interface PDFHighlightContent {
  text?: string;
  image?: string;
  color: HighlightColor;
}

export interface PDFHighlight extends Highlight {
  location: PDFHighlightLocation;
  content: PDFHighlightContent;
}

export interface NewPDFHighlight
  extends Omit<PDFHighlight, "id">,
    Partial<Pick<PDFHighlight, "id">> {}

export interface PartialPDFHighlight extends Partial<PDFHighlight> {
  location: PDFHighlightLocation;
}
