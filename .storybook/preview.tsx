import React from "react";
import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { useDarkMode } from "storybook-dark-mode";

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

  return <MemoryRouter>{story()}</MemoryRouter>;
});

export const parameters = {
  layout: "fullscreen",
};
