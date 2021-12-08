// Point defines a point in 2D space
export interface Point {
  x: number;
  y: number;
}

export interface Offset {
  left: number;
  top: number;
}

// Size defines width x height of something
export interface Size {
  width: number;
  height: number;
}

export interface Scale {
  scaleX: number;
  scaleY: number;
}

// Rect defined rectangle as left, top, width and height
export interface Rect extends Offset, Size {}

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
  RED,
  YELLOW,
  GREEN,
  BLUE,
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

export interface PartialHighlight extends Partial<Highlight> {
  location: HighlightLocation;
}

export interface PageElement {
  number: number;
  node: HTMLElement;
}

export interface PageView {
  viewport: Viewport;
  canvas: HTMLCanvasElement;
  textLayer?: {
    textLayerDiv: HTMLDivElement;
  };
  div: HTMLDivElement;
}

export interface Viewport {
  convertToPdfPoint: (x: number, y: number) => Array<number>;
  convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
  width: number;
  height: number;
}
