import React, { useEffect, useRef } from "react";
import useState from "react-usestateref";

import { ReactComponent as PlusIcon } from "~/assets/icons/plus-outline.svg";
import { ReactComponent as MinusIcon } from "~/assets/icons/minus-outline.svg";
import { ReactComponent as ChevronLeftIcon } from "~/assets/icons/chevron-left-outline.svg";
import { ReactComponent as CloseIcon } from "~/assets/icons/close-outline.svg";
import { ReactComponent as DocumentTextIcon } from "~/assets/icons/document-text-outline.svg";
import { ReactComponent as ChevronDoubleRightIcon } from "~/assets/icons/chevron-double-right-outline.svg";
import { ReactComponent as ChevronDoubleLeftIcon } from "~/assets/icons/chevron-double-left-outline.svg";
import { ReactComponent as CollectionIcon } from "~/assets/icons/collections-outline.svg";
import { ReactComponent as AnnotationIcon } from "~/assets/icons/annotation-outline.svg";
import { ReactComponent as BookmarkIcon } from "~/assets/icons/bookmark-outline.svg";

import { HighlightColor } from "~/lib/highlights/types";

const preventFocus = (e: React.FocusEvent) => {
  e.preventDefault();

  if (e.relatedTarget) {
    (e.relatedTarget as any)?.focus();
  } else {
    (e.currentTarget as any)?.blur();
  }
};

const roundPlaces = (value: number, places: number): number => {
  const exp = Math.pow(10, places);
  return Math.round(value * exp) / exp;
};

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
  scale?: number;
  onColorSelect?: (color: HighlightColor) => void;
  onSelectMode?: (areaSelect: boolean) => void;
  onScaleValueChange?: (value: string) => void;
}> = ({
  className,
  bottom,
  right,
  scale = 1,
  onColorSelect,
  onSelectMode,
  onScaleValueChange,
}) => {
  const [opened, setOpened] = useState(false);
  const [areaSelectActive, setAreaSelectActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>(
    HighlightColor.YELLOW
  );
  const [selectedScaleValue, setSelectedScaleValue] = useState("auto");
  const [currentScale, setCurrentScale] = useState(scale);

  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  useEffect(() => {
    if (onColorSelect) onColorSelect(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    if (onSelectMode) onSelectMode(areaSelectActive);
  }, [areaSelectActive]);

  useEffect(() => {
    if (onScaleValueChange) {
      if (selectedScaleValue === "custom") {
        onScaleValueChange(currentScale + "");
      } else {
        onScaleValueChange(selectedScaleValue);
        setTimeout(() => {
          console.log(scaleRef.current);
          setCurrentScale(scaleRef.current);
        }, 100);
      }
    }
  }, [selectedScaleValue, currentScale]);

  useEffect(() => {
    if (scale !== currentScale) setCurrentScale(scale);
  }, [scale]);

  const changeScaleValue = (change: number) => {
    let value = roundPlaces(currentScale + change, 1);
    if (value < 0.2) return;

    setCurrentScale(value);
    setSelectedScaleValue("custom");
  };

  return (
    <>
      <div
        className={`absolute z-50 dropdown dropdown-top dropdown-end ${
          opened && "dropdown-open"
        } ${className}`}
        style={{ bottom, right }}
      >
        {opened && (
          <>
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
            <ul className="shadow menu items-stretch px-1 horizontal bg-base-100 rounded-box min-h-12 mr-2 animate-bounce-in">
              <li>
                <div className="flex justify-center flex-1 px-2">
                  <div className="flex items-stretch self-center">
                    <button
                      className="btn btn-circle btn-xs"
                      onClick={() => changeScaleValue(-0.1)}
                    >
                      <MinusIcon />
                    </button>
                    <button
                      className="btn btn-circle btn-xs ml-1"
                      onClick={() => changeScaleValue(+0.1)}
                    >
                      <PlusIcon />
                    </button>
                    <select
                      className="select select-bordered select-xs max-w-xs ml-2"
                      onChange={(e) => setSelectedScaleValue(e.target.value)}
                      value={selectedScaleValue}
                    >
                      <option disabled={true} selected={true} value="custom">
                        {roundPlaces(currentScale * 100, 2)}%
                      </option>
                      <option value="auto">Automatic zoom</option>
                      <option value="page-actual">Actual size</option>
                      <option value="page-fit">Page Fit</option>
                      <option value="page-width">Page Width</option>
                      <option value="0.5">50%</option>
                      <option value="0.75">75%</option>
                      <option value="1">100%</option>
                      <option value="1.25">125%</option>
                      <option value="1.5">150%</option>
                      <option value="1.75">175%</option>
                      <option value="2.0">200%</option>
                    </select>
                  </div>
                </div>
              </li>
              <li></li>
            </ul>
          </>
        )}
        <button
          className={`btn btn-primary btn-md ${
            areaSelectActive ? "btn-square" : "btn-circle"
          }`}
          tabIndex={-1}
          onClick={() => setOpened(!opened)}
          onFocus={preventFocus}
        >
          {!opened ? (
            <ChevronLeftIcon className="inline-block w-6 h-6 stroke-current" />
          ) : (
            <CloseIcon className="inline-block w-6 h-6 stroke-current" />
          )}
        </button>
      </div>
    </>
  );
};

export const ExpandButton: React.FC<{
  className?: string;
  expanded?: boolean;
  onClick?: (expand: boolean) => void;
}> = ({ className = "", expanded = false, onClick = () => null }) => {
  return (
    <div className={`absolute ${className}`}>
      <button
        className="btn btn-secondary btn-xs rounded-l-none"
        tabIndex={-1}
        onClick={() => onClick(!expanded)}
      >
        {!expanded ? (
          <ChevronDoubleRightIcon className="inline-block w-4 h-4 stroke-current" />
        ) : (
          <ChevronDoubleLeftIcon className="inline-block w-4 h-4 stroke-current" />
        )}
      </button>
    </div>
  );
};

export type SidebarTabNames = "pages" | "outline" | "annotations" | "bookmarks";

const sidebarTabs: {
  name: SidebarTabNames;
  title: string;
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
}[] = [
  {
    name: "pages",
    title: "Pages",
    Icon: CollectionIcon,
  },
  {
    name: "outline",
    title: "Outline",
    Icon: DocumentTextIcon,
  },
  {
    name: "annotations",
    title: "Annotations",
    Icon: AnnotationIcon,
  },
];

export const SidebarTabSelector: React.FC<{
  className?: string;
  selectedTab?: SidebarTabNames;
  onChange?: (tab: SidebarTabNames) => void;
}> = ({ className = "", selectedTab, onChange = () => null }) => {
  return (
    <div className={`tabs tabs-boxed justify-center ${className}`}>
      {sidebarTabs.map((tab) => (
        <a
          key={tab.name}
          className={`tab ${selectedTab === tab.name ? "tab-active" : ""}`}
          title={tab.title}
          onClick={() => onChange(tab.name)}
        >
          <tab.Icon className="inline-block w-4 h-4 stroke-current" />
        </a>
      ))}
    </div>
  );
};

export const Sidebar: React.FC<{
  selectedTab?: SidebarTabNames;
  content?: Record<SidebarTabNames, JSX.Element | null>;
  onTabChange?: (name: SidebarTabNames) => void;
}> = ({ selectedTab = "outline", content, onTabChange = () => null }) => {
  const [currentSelectedTab, setCurrentSelectedTab] =
    useState<SidebarTabNames>(selectedTab);

  useEffect(() => setCurrentSelectedTab(selectedTab), [selectedTab]);

  return (
    <div className="flex flex-col overflow-hidden p-2 w-3/4 sm:w-90 md:w-90 bg-base-100 text-base-content h-full">
      <SidebarTabSelector
        selectedTab={currentSelectedTab}
        onChange={(tab) => {
          setCurrentSelectedTab(tab);
          onTabChange(tab);
        }}
      />
      <div className="mt-2 flex-1 bg-base-200 rounded-lg p-2 overflow-y-auto">
        {sidebarTabs.map((tab, i) => (
          <div
            key={i}
            style={{
              display: currentSelectedTab === tab.name ? "block" : "none",
            }}
          >
            {content?.[tab.name]}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SidebarContent: React.FC<{
  className?: string;
  sidebar: JSX.Element;
}> = ({ className = "", sidebar, children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div
      className={`rounded-lg shadow bg-base-100 drawer drawer-mobile h-full ${className}`}
    >
      <input type="checkbox" className="drawer-toggle" checked={showSidebar} />
      <div className="flex flex-col drawer-content relative">
        <ExpandButton
          className="top-4 -left-1 z-20"
          expanded={showSidebar}
          onClick={() => setShowSidebar(!showSidebar)}
        />

        {children}
      </div>
      <div
        className="drawer-side"
        style={{
          ...(!showSidebar && { visibility: "hidden", maxWidth: 0 }),
        }}
      >
        <label
          className="drawer-overlay"
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {sidebar}
      </div>
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
