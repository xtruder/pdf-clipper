import { AtomEffect } from "recoil";

import { scaledRectToViewportRect } from "~/lib/pdf";
import { screenshotPageArea } from "~/lib/pdfjs";

import { documentHighlights, pdfPageProxy } from "./localState";

export const screenshotHighlight: (
  docId: string,
  highlightId: string
) => AtomEffect<string | undefined> =
  (docId, highlightId) =>
  ({ node, trigger, getPromise, setSelf }) => {
    if (trigger === "get") {
      getPromise(node).then(async (image) => {
        if (image) return;

        const highlights = await getPromise(documentHighlights(docId));

        const highlight = highlights.find((h) => h.id === highlightId);
        if (!highlight) return;

        if (highlight.deleted || highlight.content.text) return;

        const page = await getPromise(
          pdfPageProxy([docId, highlight.location.pageNumber - 1])
        );

        const viewport = page.getViewport({ scale: 5 });

        const area = scaledRectToViewportRect(
          highlight.location.boundingRect,
          viewport
        );

        setSelf(await screenshotPageArea(page, { scale: 5, area }));
      });
    }
  };
