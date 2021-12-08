import { Color } from "./types";

export const colorToClassNames: Record<Color, string> = {
  [Color.RED]: "bg-red-100 text-red-800",
  [Color.YELLOW]: "bg-yellow-100 text-yellow-800",
  [Color.GREEN]: "bg-green-100 text-green-800",
  [Color.BLUE]: "bg-blue-100 text-blue-800",
};
