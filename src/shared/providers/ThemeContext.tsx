import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { StatusBar } from "react-native";

import { AppTheme, getTheme, ThemeMode } from "../../../themes/Theme";

const THEME_STORAGE_KEY = "theme-mode";

type ThemeContextValue = {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((value) => {
      if (value === "dark" || value === "light") {
        setMode(value);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((current) => {
      const nextMode = current === "dark" ? "light" : "dark";
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => undefined);
      return nextMode;
    });
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = useMemo(
    () => ({
      theme,
      isDark: mode === "dark",
      toggleTheme
    }),
    [theme, mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
