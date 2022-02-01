import { Rect } from "~/lib/dom";

export interface Scale {
  scaleX: number;
  scaleY: number;
}

// ScaledRect defines rectangle scaled on some size
export interface ScaledRect extends Rect, Scale {}

export interface PageRect extends Rect {
  // page number
  pageNumber: number;
}

export interface ScaledPageRect extends PageRect, Scale {}

// location of a highlight

export interface HighlightLocation {
  // bounding area box of highlight, is area over all highlight areas
  boundingRect: ScaledPageRect;

  // areas for higlight
  rects: ScaledPageRect[];

  // number of page where highlight is starting
  pageNumber: number;

  // ?
  usePdfCoordinates?: boolean;
}

export enum HighlightColor {
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
}

export interface HighlightContent {
  text?: string;
  image?: string;
}

export interface HighlightComment {
  text: string;
  emoji: string;
}

export interface Highlight {
  id: string;
  location: HighlightLocation;
  content: HighlightContent;
  color: HighlightColor;
  comment?: HighlightComment;
}

export interface NewHighlight
  extends Omit<Highlight, "id">,
    Partial<Pick<Highlight, "id">> {}

export interface PartialHighlight extends Partial<Highlight> {
  location: HighlightLocation;
}
