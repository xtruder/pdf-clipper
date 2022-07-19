import { UserConfig } from "vite";

import reactRefresh from "@vitejs/plugin-react-refresh";
import tsConfigPaths from "vite-tsconfig-paths";
import windiCSS from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";

import merge from "ts-deepmerge";

export const config: UserConfig = {
  plugins: [tsConfigPaths(), windiCSS(), svgr()],
  build: {
    minify: "esbuild",
    target: "esnext",
  },
};

const extraConfig: UserConfig = {
  plugins: [reactRefresh()],
};

// https://vitejs.dev/config/
export default merge(extraConfig, config);