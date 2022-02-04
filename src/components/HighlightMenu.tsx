import React from "react";

import { HighlightColor } from "~/models";

export interface HighlightMenuProps {
  color: HighlightColor;
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
