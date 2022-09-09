import { defineConfig } from "vitest/config";

import tsConfigPaths from "vite-tsconfig-paths";
import windiCSS from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), windiCSS()],
  build: {
    minify: "esbuild",
    target: "esnext",
  },
});
