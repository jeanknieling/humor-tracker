export type ThemeMode = "light" | "dark";

const fonts = {
  sizes: {
    title: 24,
    subtitle: 20,
    body: 14
  },
  family: {
    regular: "regular",
    bold: "extraBold",
    italic: "mediumItalic"
  }
} as const;

const shadows = {
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10
  }
} as const;

const lightColors = {
  background: "#F2F2F2",
  paper: "#FFFFFF",
  text: "#000000",
  textPlaceholder: "#A1A1A1",
  primary: "#926DFF",
  primaryText: "#FFFFFF",
  error: "#FF0000",
  highlight: "#E0D53B",
  backgroundHighlight: "rgba(224, 213, 59, 0.17)",
  backgroundOverlay: "rgba(0,0,0,0.4)"
} as const;

const darkColors = {
  background: "#121212",
  paper: "#1E1E1E",
  text: "#F5F5F5",
  textPlaceholder: "#8A8A8A",
  primary: "#A78BFF",
  primaryText: "#FFFFFF",
  error: "#FF6B6B",
  highlight: "#E0D53B",
  backgroundHighlight: "rgba(224, 213, 59, 0.22)",
  backgroundOverlay: "rgba(255,255,255,0.1)"
} as const;

export type ThemeColors = {
  background: string;
  paper: string;
  text: string;
  textPlaceholder: string;
  primary: string;
  primaryText: string;
  error: string;
  highlight: string;
  backgroundHighlight: string;
  backgroundOverlay: string;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
  fonts: typeof fonts;
  shadows: typeof shadows;
};

export function getTheme(mode: ThemeMode): AppTheme {
  return {
    mode,
    colors: mode === "dark" ? darkColors : lightColors,
    fonts,
    shadows
  };
}

export const theme = getTheme("light");
