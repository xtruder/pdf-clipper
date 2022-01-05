import React, { useEffect, useState } from "react";

import { ReactComponent as MenuIcon } from "../assets/icons/menu-outline.svg";
import { ReactComponent as PlusIcon } from "~/assets/icons/plus-outline.svg";
import { ReactComponent as MinusIcon } from "~/assets/icons/minus-outline.svg";
import { ReactComponent as ChevronLeftIcon } from "~/assets/icons/chevron-left-outline.svg";
import { ReactComponent as CloseIcon } from "~/assets/icons/close-outline.svg";
import { ReactComponent as PencilAltIcon } from "~/assets/icons/pencil-alt-outline.svg";
import { ReactComponent as DocumentTextIcon } from "~/assets/icons/document-text-outline.svg";
import { HighlightColor } from "~/types";

const highlightColors = [
  HighlightColor.RED,
  HighlightColor.GREEN,
  HighlightColor.BLUE,
  HighlightColor.YELLOW,
];

const colorToClass: Record<HighlightColor, string> = {
  [HighlightColor.RED]: "bg-red-300",
  [HighlightColor.YELLOW]: "bg-yellow-300",
  [HighlightColor.GREEN]: "bg-green-300",
  [HighlightColor.BLUE]: "bg-blue-300",
};

export const ActionButton: React.FC<{
  className?: string;
  bottom: number;
  right: number;
  onColorSelect?: (color: HighlightColor) => void;
  onSelectMode?: (areaSelect: boolean) => void;
}> = ({ className, bottom, right, onColorSelect, onSelectMode }) => {
  const [opened, setOpened] = useState(false);
  const [areaSelectActive, setAreaSelectActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );

  useEffect(() => {
    if (onColorSelect) onColorSelect(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    if (onSelectMode) onSelectMode(areaSelectActive);
  }, [areaSelectActive]);

  return (
    <>
      <ActionBar
        bottom={bottom}
        right={right + 50}
        className={`${!opened ? "hidden" : ""} animate-bounce-in`}
      />
      <div
        className={`absolute z-50 dropdown dropdown-top dropdown-end ${
          opened && "dropdown-open"
        } ${className}`}
        style={{ bottom, right }}
      >
        <button
          className={`btn btn-primary btn-md ${
            areaSelectActive ? "btn-square" : "btn-circle"
          }`}
          tabIndex={-1}
          onClick={() => setOpened(!opened)}
          onFocus={(e) => {
            e.preventDefault();
            if (e.relatedTarget) {
              (e.relatedTarget as any)?.focus();
            } else {
              e.currentTarget.blur();
            }
          }}
        >
          {!opened ? (
            <ChevronLeftIcon className="inline-block w-6 h-6 stroke-current" />
          ) : (
            <CloseIcon className="inline-block w-6 h-6 stroke-current" />
          )}
        </button>
        {opened && (
          <ul className="shadow menu compact dropdown-content bg-base-100 rounded-box w-16 mb-2 -mr-2 animate-bounce-in">
            {highlightColors.map((color) => {
              const selectedCls =
                selectedColor === color ? "bg-primary-focus" : "";

              return (
                <li key={color} className={`${selectedCls}`}>
                  <a onClick={() => setSelectedColor(color)}>
                    <div
                      className={`rounded-full w-6 h-6 ${colorToClass[color]}`}
                    />
                  </a>
                </li>
              );
            })}
            <li>
              <a onClick={() => setAreaSelectActive(!areaSelectActive)}>
                {areaSelectActive ? (
                  <DocumentTextIcon />
                ) : (
                  <div className="w-6 h-6 border-base-content border-width-2"></div>
                )}{" "}
              </a>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export const ActionBar: React.FC<{
  className?: string;
  right: number;
  bottom: number;
}> = ({ className, right, bottom }) => {
  return (
    <div className={`absolute ${className}`} style={{ right, bottom }}>
      <ul className="menu items-stretch px-1 shadow-lg horizontal rounded-box min-h-10">
        <li>
          <div className="flex justify-center flex-1 px-2">
            <div className="flex items-stretch self-center">
              <button className="btn btn-circle btn-xs no-animation">
                <MinusIcon />
              </button>
              <button className="btn btn-circle btn-xs no-animation ml-1">
                <PlusIcon />
              </button>
              <select className="select select-bordered select-xs max-w-xs ml-2">
                <option disabled={true} selected={true}>
                  Zoom: 120%
                </option>
                <option>Automatic zoom</option>
                <option>Actual size</option>
                <option>Page Fit</option>
                <option>Page Width</option>
                <option>50%</option>
                <option>75%</option>
                <option>100%</option>
                <option>125%</option>
                <option>150%</option>
                <option>175%</option>
                <option>200%</option>
              </select>
            </div>
          </div>
        </li>
        <li></li>
      </ul>
    </div>
  );
};

// const TopBar: React.FC<{
//   actionsLeft?: JSX.Element;
//   actionsCenter?: JSX.Element;
//   actionsRight?: JSX.Element;
//   isMobile?: boolean;
// }> = ({
//   actionsLeft = <span>left</span>,
//   actionsCenter = <span>center</span>,
//   actionsRight = <span>right</span>,
//   isMobile,
// }) => {
//   return (
//     <div className="menu horizontal p-1 w-full bg-primary text-neutral-content">
//       <div className={`flex-none`}>
//         <label
//           htmlFor="main-drawer-toggle"
//           className="btn btn-sm btn-square btn-ghost btn-outline"
//         >
//           <MenuIcon className="inline-block w-4 h-4 stroke-current" />
//         </label>
//       </div>

//       <div className="flex flex-none px-2">
//         <div className="flex items-stretch self-center">{actionsLeft}</div>
//       </div>

//       <div className="flex justify-center flex-1 px-2">
//         <div className="flex items-stretch self-center">
//           <button className="btn btn-circle btn-xs no-animation">
//             <MinusIcon />
//           </button>
//           <button className="btn btn-circle btn-xs no-animation ml-1">
//             <PlusIcon />
//           </button>
//           <select className="select select-bordered select-xs max-w-xs ml-2">
//             <option disabled={true} selected={true}>
//               Zoom: 120%
//             </option>
//             <option>Automatic zoom</option>
//             <option>Actual size</option>
//             <option>Page Fit</option>
//             <option>Page Width</option>
//             <option>50%</option>
//             <option>75%</option>
//             <option>100%</option>
//             <option>125%</option>
//             <option>150%</option>
//             <option>175%</option>
//             <option>200%</option>
//           </select>
//         </div>
//       </div>

//       <div className="flex flex-none px-2">
//         <div className="flex items-stretch self-center">{actionsRight}</div>
//       </div>
//     </div>
//   );
// };

// const MobileLayout: React.FC<{
//   leftSidebar: JSX.Element;
//   topBar: JSX.Element;
//   bottomBar?: JSX.Element;
// }> = ({ leftSidebar, topBar, bottomBar, children }) => {
//   const [sidebarToggled, setSidebarToggled] = useState(false);

//   return (
//     <div className="container mx-auto bg-base-200 h-screen">
//       <div className="drawer h-full w-full">
//         <input
//           id="main-drawer-toggle"
//           type="checkbox"
//           className="drawer-toggle"
//           onChange={() => setSidebarToggled(!sidebarToggled)}
//         />
//         <div className="flex flex-col drawer-content">
//           <div className="flex-none">{topBar}</div>
//           <div className="flex-1 p-4">{children}</div>
//           <div className="flex-none flex-wrap">{bottomBar}</div>
//         </div>
//         <div className="drawer-side">
//           <label
//             htmlFor="main-drawer-toggle"
//             className="drawer-overlay"
//           ></label>
//           {leftSidebar}
//         </div>
//       </div>
//     </div>
//   );
// };

// const DesktopLayout: React.FC<{
//   leftSidebar?: JSX.Element;
//   topBar: JSX.Element;
// }> = ({ leftSidebar, topBar, children }) => {
//   return (
//     <div className="container mx-auto bg-base-200">
//       <div className="flex flex-col h-full">
//         <div className="flex flex-col">{topBar}</div>
//         <div className="flex flex-row">
//           {leftSidebar}
//           <div>{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const PDFControls: React.FC = ({}) => {
//   const menu = (
//     <ul className="p-4 overflow-y-auto menu w-50 bg-base-100">
//       <li>
//         <a>Item 1</a>
//       </li>
//       <li>
//         <a>Item 2</a>
//       </li>
//     </ul>
//   );

//   return (
//     <DesktopLayout topBar={<TopBar />} leftSidebar={<div>sidebar</div>}>
//       {" "}
//       contents
//     </DesktopLayout>
//   );
// };
