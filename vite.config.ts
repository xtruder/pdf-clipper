/// <reference types="vitest" />
import { defineConfig } from "vite";

// vite plugins
import react from "@vitejs/plugin-react";
import windiCSS from "vite-plugin-windicss";
import svgr from "vite-plugin-svgr";
import tsConfigPaths from "vite-tsconfig-paths";
import graphqlCodegen from "vite-plugin-graphql-codegen";

import { babelPlugin } from "@graphql-codegen/gql-tag-operations-preset";

// vite config: https://vitejs.dev/config/
// vitest config: https://vitest.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: { plugins: [[babelPlugin, { artifactDirectory: "./src/gql" }]] },
    }),
    tsConfigPaths(),
    windiCSS(),
    svgr(),
    graphqlCodegen(),
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
