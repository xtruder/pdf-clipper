import React, { Suspense, useEffect, FC, PropsWithChildren } from "react";

import { addDecorator } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { useViewport } from "../src/lib/react-hooks";

import {
  ContextProgressProvider,
  useContextProgress,
  TopbarProgressIndicator,
} from "../src/ui/ProgressIndicator";

import "virtual:windi.css";
//import "../src/App.css";

addDecorator((story, ctx) => {
  const isDarkMode = useDarkMode();

  const { height, width } = useViewport();

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
