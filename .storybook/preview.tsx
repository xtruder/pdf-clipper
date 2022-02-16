import React, { Suspense } from "react";
import { addDecorator } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import {
  ContextProgressProvider,
  useContextProgress,
  TopbarProgressIndicator,
} from "../src/components/ProgressIndicator";

import "virtual:windi.css";
import "../src/App.css";

addDecorator((story, ctx) => {
  const isDarkMode = useDarkMode();

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
