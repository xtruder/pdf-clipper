import React, { Suspense, FC, PropsWithChildren, useEffect } from "react";

import { addDecorator } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { useWindowSize } from "@react-hook/window-size";

import {
  ContextProgressProvider,
  useContextProgress,
  TopbarProgressIndicator,
} from "../src/ui/ProgressIndicator";

import "virtual:windi.css";
//import "../src/App.css";

addDecorator((story, ctx) => {
  const isDarkMode = useDarkMode();
  const [width, height] = useWindowSize();

  // define global --vh and --vw css variables that have viewport width and height set
  useEffect(() => {
    document.documentElement.style.setProperty("--vh", `${height}px`);
    document.documentElement.style.setProperty("--vw", `${width}px`);
  }, [width, height]);

  // set theme on html element
  document.documentElement.setAttribute(
    "data-theme",
    isDarkMode ? "dark" : "light"
  );

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const Story: React.FC = () => story();

  const ShowProgress: FC = () => (
    <TopbarProgressIndicator {...useContextProgress()} />
  );

  const StoryWrapper: FC<PropsWithChildren> = ({ children }) => (
    <ContextProgressProvider>
      <Suspense fallback={<ShowProgress />}>{children}</Suspense>
    </ContextProgressProvider>
  );

  return (
    <StoryWrapper>
      <Story />
    </StoryWrapper>
  );
});

export const parameters = {
  layout: "fullscreen",
};
