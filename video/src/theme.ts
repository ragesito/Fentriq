import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const grotesk = loadGrotesk("normal", { weights: ["500", "600", "700"] })
  .fontFamily;
export const inter = loadInter("normal", { weights: ["400", "500", "600"] })
  .fontFamily;
export const mono = loadMono("normal", { weights: ["500"] }).fontFamily;

export const C = {
  bg: "#0B0C0F",
  surface: "#15171C",
  surface2: "#1C1F27",
  border: "#262B35",
  text: "#F4F6F8",
  muted: "#9CA3B2",
  accent: "#4F5BF7",
  accent2: "#8A6CFF",
  facetLight: "#AEB4C2",
  white: "#FFFFFF",
  red: "#F26D6D",
  green: "#4ADE80",
} as const;

export const grad = `linear-gradient(135deg, ${C.accent}, ${C.accent2})`;

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
