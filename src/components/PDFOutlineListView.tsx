import React, { useEffect, useState } from "react";

import { PDFDocumentProxy } from "pdfjs-dist";
import { getDocumentOutline, OutlineNode } from "~/lib/pdfjs";

import { ReactComponent as ChevronUpIcon } from "~/assets/icons/chevron-up-outline.svg";
import { ReactComponent as ChevronDownIcon } from "~/assets/icons/chevron-down-outline.svg";
import { ScrollPosition } from "./PDFDisplay";

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

const PDFOutlineItem: React.FC<{
  node: OutlineNode;
  depth: number;
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

export interface PDFOutlineListViewProps {
  document: PDFDocumentProxy;
  onOutlineNodeClicked?: (position: ScrollPosition) => void;
}

export const PDFOutlineListView: React.FC<PDFOutlineListViewProps> = ({
  document,
  onOutlineNodeClicked = () => null,
}) => {
  const [outline, setOutline] = useState<OutlineNode[]>();

  useEffect(
    (async () => {
      const outline = await getDocumentOutline(document);
      setOutline(outline);
    }) as any,
    []
  );

  const renderOutlineNodes = (
    nodes: OutlineNode[],
    depth: number = 0
  ): JSX.Element[] =>
    nodes.map((node, i) => {
      const childNodes = renderOutlineNodes(node.items, depth + 1);

      return (
        <PDFOutlineItem
          key={i}
          node={node}
          depth={depth}
          onClick={() =>
            onOutlineNodeClicked({
              pageNumber: node.pageNumber!,
              destArray: node.dest as any[],
            })
          }
        >
          {childNodes.length > 0 && childNodes}
        </PDFOutlineItem>
      );
    });

  return (
    <ul className="inline-block">
      {outline ? renderOutlineNodes(outline) : <></>}
    </ul>
  );
};
