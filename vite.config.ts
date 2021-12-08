import { UserConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsConfigPaths from "vite-tsconfig-paths";
import windiCSS from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";

import merge from "ts-deepmerge";

export const baseConfig: UserConfig = {
  plugins: [tsConfigPaths(), windiCSS(), svgr()],
};

const extraConfig: UserConfig = {
  plugins: [reactRefresh()],
};

// https://vitejs.dev/config/
export default merge(extraConfig, baseConfig);
