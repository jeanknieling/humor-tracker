import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

import { startOfDay } from "../utils/date";

type SelectedDayContextValue = {
  selectedDay: Date;
  setSelectedDay: (day: Date) => void;
};

const SelectedDayContext = createContext<SelectedDayContextValue | null>(null);

export function SelectedDayProvider({ children }: { children: ReactNode }) {
  const [selectedDay, setSelectedDayState] = useState<Date>(() => startOfDay(new Date()));

  const setSelectedDay = useCallback((day: Date) => {
    setSelectedDayState(startOfDay(day));
  }, []);

  const value = useMemo(
    () => ({
      selectedDay,
      setSelectedDay
    }),
    [selectedDay, setSelectedDay]
  );

  return (
    <SelectedDayContext.Provider value={value}>{children}</SelectedDayContext.Provider>
  );
}

export function useSelectedDay() {
  const context = useContext(SelectedDayContext);
  if (!context) {
    throw new Error("useSelectedDay must be used within SelectedDayProvider");
  }
  return context;
}
