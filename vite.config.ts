import { defineConfig } from "vite";
import path from "path";

// vite plugins
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// vite config: https://vitejs.dev/config/
// vitest config: https://vitest.dev/config/
export default defineConfig(({ }) => {
  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      svgr(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      minify: "esbuild",
      target: "esnext",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
  };
});
