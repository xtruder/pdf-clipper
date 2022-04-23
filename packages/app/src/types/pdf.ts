import { ScaledPageRect } from "~/lib/pdf";

import { DocumentOutline } from "./documentInfo";
import { DocumentHighlightColor } from "./documentHighlight";

export interface PDFDocumentMeta {
  pageCount: number;
  title?: string;
  author?: string;
  keywords?: string;
  firstPage?: string;
  outline?: DocumentOutline;
}

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
  thumbnail?: string;
  color: DocumentHighlightColor;
}

export interface PDFHighlight {
  id: string;
  location: PDFHighlightLocation;
  content: PDFHighlightContent;
}

export interface PartialPDFHighlight extends Partial<PDFHighlight> {
  location: PDFHighlightLocation;
}
