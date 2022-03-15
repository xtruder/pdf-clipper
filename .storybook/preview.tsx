import React, { Suspense, useEffect } from "react";
import { addDecorator } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { useViewport } from "../src/lib/react";

import {
  ContextProgressProvider,
  useContextProgress,
  TopbarProgressIndicator,
} from "../src/components/ProgressIndicator";

import { StateCtx } from "../src/state/state";
import { localState } from "../src/state/localState";

import "virtual:windi.css";
import "../src/App.css";
import { RecoilRoot } from "recoil";

addDecorator((story, ctx) => {
  const state = localState;

  const isDarkMode = useDarkMode();

  const { height, width } = useViewport();

  useEffect(() => {
    document.documentElement.style.setProperty("--vh", `${height}px`);
    document.documentElement.style.setProperty("--vw", `${width}px`);
  }, [height]);

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

  const ShowProgress: React.FC = () => (
    <TopbarProgressIndicator {...useContextProgress()} />
  );

  const StoryWrapper: React.FC = ({ children }) => (
    <RecoilRoot>
      <StateCtx.Provider value={state}>
        <ContextProgressProvider>
          <Suspense fallback={<ShowProgress />}>{children}</Suspense>
        </ContextProgressProvider>
      </StateCtx.Provider>
    </RecoilRoot>
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
