import { ReactNode } from "react";

import { SelectedDayProvider } from "./SelectedDayContext";
import { ThemeProvider } from "./ThemeContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SelectedDayProvider>{children}</SelectedDayProvider>
    </ThemeProvider>
  );
}
