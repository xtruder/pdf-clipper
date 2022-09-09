import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import windiCSS from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";
import { babelPlugin } from "@graphql-codegen/gql-tag-operations-preset";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: { plugins: [[babelPlugin, { artifactDirectory: "./src/gql" }]] },
    }),
    tsConfigPaths(),
    windiCSS(),
    svgr(),
  ],
  build: {
    minify: "esbuild",
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  test: {
    environment: "happy-dom",
  },
});
