import { transform, defineConfig } from "windicss/helpers";
import lineClamp from "windicss/plugin/line-clamp";

export default defineConfig({
  plugins: [transform("daisyui"), lineClamp],
  darkMode: "class",
  daisyui: {
    styled: true,
    rtl: false,
    themes: ["light", "dark"],
  },
  extract: {
    include: ["src/**/*.tsx", "../components/src/**/*.tsx"],
  },
});
