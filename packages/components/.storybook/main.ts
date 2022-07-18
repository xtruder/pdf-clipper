import type { UserConfig } from "vite";
import type { StorybookConfig } from "@storybook/react/types";
import merge from "ts-deepmerge";

import { baseConfig } from "../../app/vite.config";

export default {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode",
  ],
  core: {
    builder: "storybook-builder-vite" as any,
  },
  async viteFinal(config: UserConfig) {
    return merge(baseConfig, config);
  },
} as StorybookConfig;
