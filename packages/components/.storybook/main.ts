import { mergeConfig } from "vite";
import { UserConfig } from "vitest/config";
import type { StorybookConfig } from "@storybook/react/types";

import config from "../../app/vite.config";

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
    return mergeConfig(storybookConfig, config);
  },
} as StorybookConfig;
