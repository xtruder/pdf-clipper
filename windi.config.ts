import { transform, defineConfig } from "windicss/helpers";

export default defineConfig({
  plugins: [transform("daisyui")],
  darkMode: "class",
  daisyui: {
    styled: true,
    rtl: false,
    themes: ["light", "dark"],
  },
});
