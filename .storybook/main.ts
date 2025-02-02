import { mergeConfig, UserConfig } from "vite";

import svgr from "vite-plugin-svgr";

import type { StorybookConfig } from "@storybook/react-vite";

const viteConfig: UserConfig = {
  plugins: [svgr()],
  build: {
    minify: "esbuild",
    target: "esnext",
  },
};

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode",
  ],
  framework: "@storybook/react-vite",
  async viteFinal(storybookConfig: UserConfig) {
    return mergeConfig(storybookConfig, viteConfig);
  },
};

export default config;
