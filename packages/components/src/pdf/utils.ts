import unique from "just-unique";
import groupBy from "just-group-by";
import { zeroPad } from "number-slayer";

import { Offset } from "~/lib/dom";
import { PDFHighlightInfoWithKey } from "./types";

// get highlights per page, that are on that page or have rects on page
export const groupHighlightsByPage = (
  highlights: PDFHighlightInfoWithKey[]
): Record<number, PDFHighlightInfoWithKey[]> => {
  // get all rects from all highlights
  const allRects = highlights
    .map((highlight) =>
      highlight.location.rects.map((rect) => ({
        ...rect,
        pageNumber: rect.pageNumber || highlight.location.pageNumber,
        highlight,
      }))
    )
    .flat();

  // get highlights and rects by pages
  const highlightsByPage = groupBy(highlights, (h) => h.location.pageNumber);
  const rectsByPage = groupBy(allRects, (r) => r.pageNumber);

  // get a list of all pages where rects or highlights are
  const pageNumbers: number[] = unique(
    Object.keys(highlightsByPage).concat(Object.keys(rectsByPage))
  ).map(Number);

  // get highlights per page, containing highlight that is on a page or
  // highlights that have rects on a page
  const pageSpecificHighlights = pageNumbers
    .map((pageNumber) => {
      const pageRects = rectsByPage[pageNumber] || [];
      const pageHighlights = highlightsByPage[pageNumber] || [];

      const highlightsOnPage = unique([
        ...pageRects.map((rect) => rect.highlight),
        ...pageHighlights,
      ]);

      return highlightsOnPage.map((h) => ({
        ...h,
        location: { ...h.location, displayPage: pageNumber },
      }));
    })
    .flat();

  // group by display page number
  return groupBy(pageSpecificHighlights, (h) => h.location.displayPage);
};

export const getHighlightSequence = (
  pageNumber: number,
  offset: Offset
): string => `${zeroPad(pageNumber, 3, 0)}/${zeroPad(offset.top, 5, 0)}`;
