import React, { useEffect } from "react";

import { Preview } from "@storybook/react";
import { useDarkMode } from "storybook-dark-mode";

import { useWindowSize } from "@react-hook/window-size";

import "../src/index.css";
import "../src/App.css";

const preview: Preview = {
  decorators: [
    (Story, { }) => {
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

      return (
        <Story />
      );
    },
  ],
};

export default preview;
