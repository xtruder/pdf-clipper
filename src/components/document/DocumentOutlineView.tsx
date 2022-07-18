import React, { useState } from "react";

import { ReactComponent as ChevronUpIcon } from "~/assets/icons/chevron-up-outline.svg";
import { ReactComponent as ChevronDownIcon } from "~/assets/icons/chevron-down-outline.svg";
import { DocumentOutline, OutlineNode } from "~/types";

export interface OutlinePosition {
  pageNumber?: number;
  location?: any;
  top?: number;
}

/*
node.dest:
0: Object { num: 747, gen: 0 }
  gen: 0
  num: 747
1: Object { name: "XYZ" }
2: 45.828
3: 263.352
4: null
*/

const OutlineItem: React.FC<{
  node: OutlineNode;
  depth: number;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ node, children, onClick = () => null }) => {
  const [isOpened, setIsOpened] = useState(true);
  const [mouseOver, setMouseOver] = useState(false);

  const Icon = isOpened ? ChevronUpIcon : ChevronDownIcon;

  return (
    <li>
      <div
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        <div className="rounded-lg inline-block m-0.5">
          <span
            className="cursor-pointer"
            onClick={(e) => {
              onClick();
              e.stopPropagation();
            }}
          >
            {mouseOver ? <b>{node.title}</b> : node.title}
          </span>
          {children && (
            <button
              onClick={() => setIsOpened(!isOpened)}
              className="btn btn-xs btn-circle ml-1.5"
            >
              <Icon className="w-3 h-3 stroke-current" />
            </button>
          )}
        </div>
      </div>
      {children && (
        <ul className="ml-2" style={{ display: isOpened ? "block" : "none" }}>
          {children}
        </ul>
      )}
    </li>
  );
};

export interface DocumentOutlineViewProps {
  outline: DocumentOutline;
  onOutlineNodeClicked?: (position: OutlinePosition) => void;
}

export const DocumentOutlineView: React.FC<DocumentOutlineViewProps> = ({
  outline,
  onOutlineNodeClicked = () => null,
}) => {
  const renderOutlineNodes = (
    nodes: OutlineNode[],
    depth: number = 0
  ): JSX.Element[] =>
    nodes.map((node, i) => {
      const childNodes = renderOutlineNodes(node.items ?? [], depth + 1);

      return (
        <OutlineItem
          key={i}
          node={node}
          depth={depth}
          onClick={() =>
            onOutlineNodeClicked({
              pageNumber: node.pageNumber!,
              location: node.position,
            })
          }
        >
          {childNodes.length > 0 && childNodes}
        </OutlineItem>
      );
    });

  return (
    <ul className="inline-block">
      {outline ? renderOutlineNodes(outline.items) : <></>}
    </ul>
  );
};
