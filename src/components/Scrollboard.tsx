import React, { ForwardedRef, useEffect, useRef } from "react";
import useMergedRef from "@react-hook/merged-ref";

export const Scrollboard: React.FC<{
  innerRef?: ForwardedRef<HTMLDivElement | null>;
  contentRef?: ForwardedRef<HTMLDivElement | null>;
  center?: boolean;
}> = ({ children, innerRef, contentRef, center = true }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollLeft =
      scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight / 2 - scrollRef.current.clientHeight / 2;
  }, [scrollRef]);

  return (
    <div
      ref={innerRef ? useMergedRef(innerRef, scrollRef) : scrollRef}
      className="w-screen h-screen overflow-scroll bg-dark-100"
    >
      <div
        ref={contentRef}
        className={`
          flex h-600 w-600 relative
          ${center ? "justify-center items-center" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};
