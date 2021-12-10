// Left, Top, Width and Height
export interface LTWH {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Point defines a point in 2D space
export type Point = {
  x: number;
  y: number;
};

// Size defines width x height of something
export type Size = {
  width: number;
  height: number;
};

export interface PageArea {
  // area left top position
  leftTop: Point;

  // area left bottom position
  rightBotton: Point;

  // size of a page
  pageSize: Size;

  // page number
  pageNumber: number;
}

// location of a highlight
export interface HighlightLocation {
  // bounding area box of highlight, is area over all highlight areas
  boundingArea: PageArea;

  // areas for higlight
  areas: PageArea[];

  // number of page where highlight is starting
  pageNumber: number;

  // ?
  usePdfCoordinates?: boolean;
}

export interface Content {
  text?: string;
  image?: string;
}

export interface Comment {
  text: string;
  emoji: string;
}

export interface NewHighlight {
  location: HighlightLocation;
  content: Content;
  comment: Comment;
}

export interface Highlight extends NewHighlight {
  id: string;
}

export type PartialHighlight = Partial<Highlight> & {
  location: HighlightLocation;
};

export interface PageElement {
  number: number;
  node: HTMLElement;
}

export interface PageView {
  viewport: Viewport;
  canvas: HTMLCanvasElement;
}

export interface Viewport {
  convertToPdfPoint: (x: number, y: number) => Array<number>;
  convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
  width: number;
  height: number;
}
