import React, { useState } from "react";

import { HighlightColor } from "~/types";

import { ReactComponent as PencilAltIcon } from "../assets/icons/pencil-alt-outline.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash-outline.svg";
import { ReactComponent as ChevronDoubleDownIcon } from "../assets/icons/chevron-double-down-outline.svg";
import { ReactComponent as ChevronDoubleUpIcon } from "../assets/icons/chevron-double-up-outline.svg";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-200",
  [HighlightColor.YELLOW]: "bg-yellow-200",
  [HighlightColor.GREEN]: "bg-green-200",
  [HighlightColor.BLUE]: "bg-blue-200",
};

export interface HighlightCardProps {
  text?: string;
  image?: string;
  color?: HighlightColor;
  pageNumber: number;
  maxLength?: number;
  onClicked?: () => void;
  onDeleteClicked?: () => void;
  onEditClicked?: () => void;
  onPageClicked?: () => void;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  text,
  image,
  pageNumber,
  color,
  maxLength = 100,
  onClicked = () => null,
  onDeleteClicked = () => null,
  onEditClicked = () => null,
  onPageClicked = () => null,
}) => {
  const [showMore, setShowMore] = useState(false);

  const colorCls = colorToClass[color || HighlightColor.YELLOW];

  let textLength = text?.length || 0;
  let highlight: JSX.Element = <a>Empty highlight</a>;
  if (text) {
    highlight = (
      <h2
        className="text-md text-neutral hover:cursor-pointer w-full"
        onClick={() => onClicked()}
      >
        {showMore ? text : text?.substring(0, maxLength)}
        {textLength > maxLength && !showMore ? "..." : ""}
        {textLength > maxLength && (
          <a
            className="btn btn-xs ml-2 p-1"
            onClick={(e) => {
              setShowMore(!showMore);
              e.stopPropagation();
            }}
          >
            {!showMore ? (
              <>
                More <ChevronDoubleDownIcon className="w-3 h-3" />
              </>
            ) : (
              <>
                Less <ChevronDoubleUpIcon className="w-3 h-3" />
              </>
            )}
          </a>
        )}
      </h2>
    );
  } else if (image) {
    highlight = (
      <img
        src={image}
        className="h-auto w-full block hover:cursor-pointer"
        onClick={() => onClicked()}
      />
    );
  }

  return (
    <div
      className={`rounded-md border-2 border-neutral flex-col p-2 ${colorCls}`}
    >
      <div className="flex">
        <div className="flex flex-grow">{highlight}</div>
      </div>
      <div className="flex flex-row mt-1">
        <div className="flex flex-grow" />
        <div className="flex flex-none">
          <button className="btn btn-xs" onClick={() => onPageClicked()}>
            Page {pageNumber}
          </button>
          <button
            className="btn btn-xs btn-circle ml-1"
            onClick={() => onDeleteClicked()}
          >
            <TrashIcon className="inline-block w-4 h-4" />
          </button>
          <button
            className="btn btn-xs btn-circle ml-1"
            onClick={() => onEditClicked()}
          >
            <PencilAltIcon className="inline-block w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
