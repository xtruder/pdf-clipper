import React, { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import useMergedRef from "@react-hook/merged-ref";

export interface ScrollboardProps {
  center?: boolean;
  contentRef?: ForwardedRef<HTMLDivElement | null>;

  onSize?: (width: number, height: number) => void;
}

export const Scrollboard: React.FC<ScrollboardProps> = forwardRef(
  ({ children, contentRef, center = true, onSize }, ref) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!scrollRef.current) return;

      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight / 2 - scrollRef.current.clientHeight / 2;

      onSize &&
        onSize(scrollRef.current.scrollWidth, scrollRef.current.scrollHeight);
    }, [scrollRef]);

    return (
      <div
        ref={useMergedRef(ref, scrollRef)}
        className="w-screen h-screen overflow-scroll bg-dark-100"
      >
        <div
          ref={contentRef}
          className={`
            inline-flex h-600 w-600 relative
            ${center ? "justify-center items-center" : ""}`}
        >
          {children}
        </div>
      </div>
    );
  }
);
