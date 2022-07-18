import { ScaledPageRect } from "../lib/pdf";
import { HighlightColor } from "../highlights/types";

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
  thumbnail?: string;
  color: HighlightColor;
}

export interface PDFHighlight {
  id: string;
  location: PDFHighlightLocation;
  content: PDFHighlightContent;
  image?: {
    source: string;
  };
}

export * from "../highlights/types";
