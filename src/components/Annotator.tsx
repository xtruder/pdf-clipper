import React, { useState } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  IHighlight,
  Popup,
  AreaHighlight,
  NewHighlight,
} from "react-pdf-highlighter";

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const getNextId = () => String(Math.random()).slice(2);

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const Spinner: React.FC = ({}) => {
  return (
    <div className="flex justify-center h-screen">
      <div className="m-auto loader ease-linear rounded-full border-6 border-t-6 border-gray-200 h-14 w-14"></div>
    </div>
  );
};

export type HighlightChangeType = "ADD" | "UPDATE" | "REMOVE";

export type AnnotatorArgs = {
  url: string;
  highlights?: IHighlight[];
  onHighightChange?: (
    type: HighlightChangeType,
    highlight: IHighlight,
    highlights: IHighlight[]
  ) => void;
};

export const Annotator: React.FC<AnnotatorArgs> = ({
  url,
  highlights: initialHighlights = [],
  onHighightChange,
}) => {
  const [highlights, setHighlights] = useState<IHighlight[]>(initialHighlights);

  let scrollViewerTo = (_highlight: any) => {};

  const scrollToHighlightFromHash = () => {
    const id = parseIdFromHash();

    const highlight = highlights.find((highlight) => highlight.id == id);

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  const addHighlight = (newHighlight: NewHighlight) => {
    const highlight = { ...newHighlight, id: getNextId() };
    const newHighlights = [...highlights, highlight];

    setHighlights(newHighlights);
    onHighightChange && onHighightChange("ADD", highlight, newHighlights);
  };

  const updateHighlight = (id: string, position: Object, content: Object) => {
    const idx = highlights.findIndex((h) => h.id === id);
    if (idx === -1) {
      return;
    }

    const {
      id: originalId,
      position: originalPosition,
      content: originalContent,
      ...rest
    } = highlights[idx];

    const highlight = {
      id,
      position: { ...originalPosition, ...position },
      content: { ...originalContent, ...content },
      ...rest,
    };

    const newHighlights = [...highlights];
    newHighlights.splice(idx, 1, highlight);

    setHighlights(newHighlights);
    onHighightChange && onHighightChange("UPDATE", highlight, newHighlights);
  };

  return (
    <PdfLoader url={url} beforeLoad={<Spinner />}>
      {(pdfDocument) => (
        <PdfHighlighter
          pdfDocument={pdfDocument}
          highlights={highlights}
          enableAreaSelection={(event) => event.altKey}
          onScrollChange={resetHash}
          scrollRef={(scrollTo) => {
            scrollViewerTo = scrollTo;
            scrollToHighlightFromHash();
          }}
          onSelectionFinished={(
            position,
            content,
            hideTipAndSelection,
            transformSelection
          ) => (
            <Tip
              onOpen={transformSelection}
              onConfirm={(comment) => {
                addHighlight({ content, position, comment });

                hideTipAndSelection();
              }}
            />
          )}
          highlightTransform={(
            highlight,
            index,
            setTip,
            hideTip,
            viewportToScaled,
            screenshot,
            isScrolledTo
          ) => {
            const isTextHighlight = !Boolean(
              highlight.content && highlight.content.image
            );

            const component = isTextHighlight ? (
              <Highlight
                isScrolledTo={isScrolledTo}
                position={highlight.position}
                comment={highlight.comment}
              />
            ) : (
              <AreaHighlight
                isScrolledTo={isScrolledTo}
                highlight={highlight}
                onChange={(boundingRect) => {
                  updateHighlight(
                    highlight.id,
                    { boundingRect: viewportToScaled(boundingRect) },
                    { image: screenshot(boundingRect) }
                  );
                }}
              />
            );

            return (
              <Popup
                popupContent={<HighlightPopup {...highlight} />}
                onMouseOver={(popupContent) =>
                  setTip(highlight, (_highlight) => popupContent)
                }
                onMouseOut={hideTip}
                key={index}
                children={component}
              />
            );
          }}
        ></PdfHighlighter>
      )}
    </PdfLoader>
  );
};
