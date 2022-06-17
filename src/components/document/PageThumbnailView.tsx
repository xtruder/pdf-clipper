import React, { ReactElement, useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export interface PageThumbnailViewProps {
  pageNumber: number;
  width: number;
  height: number;

  // thumbnail image to use
  image?: string;

  // gets trigered when thumbnail is in view
  onInView: () => void;

  // gets trigered when thumbnail is clicked
  onClick?: () => void;

  // children component
  children?: React.ReactNode;
}

export const PageThumbnailView: React.FC<PageThumbnailViewProps> = ({
  pageNumber,
  width,
  height,
  image,
  children,

  onInView,
  onClick,
}) => {
  const [inViewTriggered, setInViewTriggered] = useState<boolean>(false);
  let { ref, inView } = useInView({ threshold: 0, delay: 20 });

  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  // do not trigger immiditaely but wait 200ms, so we know thumbnail is really
  // being watched
  useEffect(() => {
    if (!inViewRef.current || inViewTriggered) return;
    setInViewTriggered(true);

    setTimeout(async () => {
      if (inViewRef.current) {
        onInView();
      } else {
        setInViewTriggered(false);
      }
    }, 100);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-md border-2 mb-1 bg-white flex flex-col relative"
      onClick={() => onClick && onClick()}
    >
      <div className="flex w-full h-full">
        <button
          className="btn btn-xs bottom-0 right-0 absolute p-1 rounded-r-none"
          onClick={() => onClick && onClick()}
        >
          Page {pageNumber}
        </button>
      </div>
      <img width={width} height={height} src={image} />
      {children}
    </div>
  );
};

export const PageThumbnailsList: React.FC<{
  children: ReactElement[];
}> = ({ children }) => {
  return (
    <ul className="items-center grid grid-cols-2 gap-2">
      {children.map((child) => (
        <li key={child.key} className="flex justify-center relative">
          {child}
        </li>
      ))}
    </ul>
  );
};
