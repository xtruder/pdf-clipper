import { useState, useEffect } from "react";
import useEvent from "@react-hook/event";

/**hook that reports whether value has changed in last interval */
export const useIsChanging = (interval: number, value: any): boolean => {
  const [lastTimer, setLastTimer] = useState<NodeJS.Timeout>();
  const [changing, setChanging] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (lastTimer) clearTimeout(lastTimer);

    setChanging(true);

    timer = setTimeout(() => setChanging(false), interval);
    setLastTimer(timer);

    return () => clearTimeout(timer);
  }, [value]);

  return changing;
};

/** Observes viewport size and outputs it's width and height */
export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEvent(window, "resize", handleWindowResize);

  // Return both the height and width
  return { width, height };
};
