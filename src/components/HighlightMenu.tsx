import React from "react";

import { DocumentHighlightColor } from "~/types";

export interface HighlightMenuProps {
  color: DocumentHighlightColor;
}

export const HighlightMenu: React.FC<HighlightMenuProps> = ({}) => {
  return (
    <ul className="menu border bg-base-100 rounded-box menu-horizontal">
      <li></li>
      <li></li>
      <li></li>
    </ul>
  );
};
