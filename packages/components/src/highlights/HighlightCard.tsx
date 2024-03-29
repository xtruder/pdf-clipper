import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { HighlightColor } from "./types";

import { ReactComponent as PencilAltIcon } from "../assets/icons/pencil-alt-outline.svg";
import { ReactComponent as TrashIcon } from "../assets/icons/trash-outline.svg";
import { ReactComponent as ChevronDoubleDownIcon } from "../assets/icons/chevron-double-down-outline.svg";
import { ReactComponent as ChevronDoubleUpIcon } from "../assets/icons/chevron-double-up-outline.svg";
import { Image } from "../ui/Image";

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.Red]: "bg-red-200",
  [HighlightColor.Yellow]: "bg-yellow-200",
  [HighlightColor.Green]: "bg-green-200",
  [HighlightColor.Blue]: "bg-blue-200",
};

export interface HighlightCardProps {
  text?: string;
  image?: string | Blob;
  fallbackImage?: string;
  color?: HighlightColor;
  pageNumber?: number;
  maxLength?: number;
  scrollIntoView?: boolean;
  selected?: boolean;

  // gets trigered when card is in view
  onInView?: (inView: boolean) => void;

  onClicked?: () => void;
  onDeleteClicked?: () => void;
  onEditClicked?: () => void;
  onPageClicked?: () => void;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  text,
  image,
  fallbackImage,
  pageNumber,
  color,
  maxLength = 100,
  scrollIntoView = false,
  selected = false,
  onClicked,
  onDeleteClicked,
  onEditClicked,
  onPageClicked,
  onInView,
}) => {
  const [showMore, setShowMore] = useState(false);

  const [inViewTriggered, setInViewTriggered] = useState<boolean>(false);
  const { ref, inView, entry } = useInView({ threshold: 1 });

  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  // do not trigger immiditaely but wait 200ms, so we know thumbnail is really
  // being watched
  useEffect(() => {
    if (!inViewRef.current || inViewTriggered) return;
    setInViewTriggered(true);

    setTimeout(async () => {
      if (inViewRef.current) {
        onInView?.(true);
      } else {
        setInViewTriggered(false);
      }
    }, 100);
  }, [inView]);

  const colorCls = colorToClass[color || HighlightColor.Yellow];

  let textLength = text?.length || 0;
  let highlight: JSX.Element = <a>Empty highlight</a>;
  if (text) {
    highlight = (
      <h2
        className="text-md text-neutral hover:cursor-pointer w-full"
        onClick={() => onClicked?.()}
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
  } else if (image || fallbackImage) {
    highlight = (
      <Image
        src={image}
        fallbackSrc={fallbackImage}
        className="h-initial w-full block hover:cursor-pointer"
        loading="lazy"
        onClick={() => onClicked?.()}
      />
    );
  }

  // scroll card into view
  useEffect(() => {
    if (scrollIntoView && entry && !inView) {
      entry.target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [scrollIntoView]);

  const borderColor = selected ? "border-error" : "border-neutral";

  return (
    <div
      className={`rounded-md border-2 ${borderColor} flex-col p-2 ${colorCls}`}
      ref={ref}
    >
      <div className="flex">
        <div className="flex flex-grow">{highlight}</div>
      </div>
      <div className="flex flex-row mt-1">
        <div className="flex flex-grow" />
        <div className="flex flex-none">
          <button className="btn btn-xs" onClick={() => onPageClicked?.()}>
            Page {pageNumber}
          </button>
          <button
            className="btn btn-xs btn-circle ml-1"
            onClick={() => onDeleteClicked?.()}
          >
            <TrashIcon className="inline-block w-4 h-4" />
          </button>
          <button
            className="btn btn-xs btn-circle ml-1"
            onClick={() => onEditClicked?.()}
          >
            <PencilAltIcon className="inline-block w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const HighlightCardList: React.FC<{
  children: ReactElement<HighlightCardProps>[];
}> = ({ children }) => {
  return (
    <ul>
      {children.map((child) => (
        <li key={child.key} className="mt-2">
          {child}
        </li>
      ))}
    </ul>
  );
};
