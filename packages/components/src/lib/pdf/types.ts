import { Rect } from "../../lib/dom";

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
