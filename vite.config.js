import { UserConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsConfigPaths from "vite-tsconfig-paths";
import windiCSS from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";

import merge from "ts-deepmerge";

/**
 * @returns {UserConfig}
 */
export const baseConfig = {
  plugins: [tsConfigPaths(), windiCSS(), svgr()],
  build: {
    minify: "esbuild",
    target: "esnext",
  },
};

/**
 * @returns {UserConfig}
 */
const extraConfig = {
  plugins: [reactRefresh()],
};

// https://vitejs.dev/config/
export default merge(extraConfig, baseConfig);
