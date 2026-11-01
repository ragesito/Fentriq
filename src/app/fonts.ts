import { Bricolage_Grotesque, Geist, Space_Grotesk } from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display-home",
  display: "swap",
});

export const body = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body-home",
  display: "swap",
});

export const mark = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-mark",
  display: "swap",
});

export const fontVariables = `${display.variable} ${body.variable} ${mark.variable}`;
