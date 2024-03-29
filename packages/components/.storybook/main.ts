import { mergeConfig } from "vite";
import { UserConfig } from "vitest/config";

import windiCSS from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";

import type { StorybookConfig } from "@storybook/react/types";

const viteConfig: UserConfig = {
  plugins: [windiCSS(), svgr()],
  build: {
    minify: "esbuild",
    target: "esnext",
  },
};

export default {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode",
  ],
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(storybookConfig: UserConfig) {
    return mergeConfig(storybookConfig, viteConfig);
  },
} as StorybookConfig;
