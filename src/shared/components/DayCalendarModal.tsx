import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  CalendarDay,
  CalendarMonthSelectorProps,
  CalendarTimeSelectorProps,
  CalendarYearSelectorProps,
  DateType,
  useDefaultStyles
} from "react-native-ui-datepicker";

import { AppTheme } from "./../../../themes/Theme";
import { useTheme } from "./../providers/ThemeContext";
import { startOfDay, toCalendarDateKey } from "./../utils/date";
import { Button } from "./Button";

dayjs.locale("pt-br");

type PickerFocus = "day" | "month" | "year" | "time";

type DayCalendarModalProps = {
  visible: boolean;
  selectedDay: Date;
  daysWithHumor: string[];
  withTime?: boolean;
  onDateChange?: (date: Date) => void;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
};

function toJsDate(value: DateType): Date | null {
  if (value == null) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toDate() : null;
}

function SyncPickerFocus({
  view,
  isOpen,
  onFocusChange
}: {
  view: Exclude<PickerFocus, "day">;
  isOpen: boolean;
  onFocusChange: (updater: (current: PickerFocus) => PickerFocus) => void;
}) {
  useEffect(() => {
    onFocusChange((current) => {
      if (isOpen) return view;
      return current === view ? "day" : current;
    });
  }, [isOpen, view, onFocusChange]);

  return null;
}

function getPickerTitle(withTime: boolean, focus: PickerFocus): string {
  switch (focus) {
    case "month":
      return "Escolher mês";
    case "year":
      return "Escolher ano";
    case "time":
      return "Escolher hora";
    default:
      return "Escolher dia";
  }
}

export function DayCalendarModal({
  visible,
  selectedDay,
  daysWithHumor,
  withTime = false,
  onDateChange,
  onConfirm,
  onCancel
}: DayCalendarModalProps) {
  const { theme, isDark } = useTheme();
  const defaultStyles = useDefaultStyles(isDark ? "dark" : "light");
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [draftDateTime, setDraftDateTime] = useState(selectedDay);
  const [pickerFocus, setPickerFocus] = useState<PickerFocus>("day");
  const draftDateTimeRef = useRef(draftDateTime);
  const dateChangeSourceRef = useRef<"month" | "year" | null>(null);
  draftDateTimeRef.current = draftDateTime;

  const daysWithHumorSet = useMemo(() => new Set(daysWithHumor), [daysWithHumor]);

  useEffect(() => {
    if (visible) {
      setDraftDateTime(selectedDay);
      draftDateTimeRef.current = selectedDay;
      setPickerFocus("day");
    }
  }, [visible, selectedDay]);

  const pickerTitle = getPickerTitle(withTime, pickerFocus);
  const pickerStyles = useMemo(
    () => ({
      ...defaultStyles,
      selected: {
        ...defaultStyles.selected,
        backgroundColor: theme.colors.primary,
        borderRadius: 8
      },
      selected_label: {
        ...defaultStyles.selected_label,
        color: theme.colors.primaryText,
        fontFamily: theme.fonts.family.bold
      },
      today: {
        ...defaultStyles.today,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 8
      },
      today_label: {
        ...defaultStyles.today_label,
        color: theme.colors.primary,
        fontFamily: theme.fonts.family.bold
      },
      day_label: {
        ...defaultStyles.day_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.regular
      },
      outside_label: {
        ...defaultStyles.outside_label,
        color: theme.colors.textPlaceholder
      },
      weekday_label: {
        ...defaultStyles.weekday_label,
        color: theme.colors.textPlaceholder,
        fontFamily: theme.fonts.family.regular
      },
      month: {
        ...defaultStyles.month,
        borderColor: theme.colors.textPlaceholder
      },
      month_label: {
        ...defaultStyles.month_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.regular
      },
      year: {
        ...defaultStyles.year,
        borderColor: theme.colors.textPlaceholder
      },
      year_label: {
        ...defaultStyles.year_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.regular
      },
      active_year: {
        ...defaultStyles.active_year,
        borderColor: theme.colors.primary
      },
      active_year_label: {
        ...defaultStyles.active_year_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.bold
      },
      month_selector_label: {
        ...defaultStyles.month_selector_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.bold
      },
      year_selector_label: {
        ...defaultStyles.year_selector_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.bold
      },
      time_selector_label: {
        ...defaultStyles.time_selector_label,
        color: theme.colors.primary,
        fontFamily: theme.fonts.family.bold
      },
      time_label: {
        ...defaultStyles.time_label,
        color: theme.colors.text,
        fontFamily: theme.fonts.family.regular
      },
      time_selected_indicator: {
        ...defaultStyles.time_selected_indicator,
        backgroundColor: theme.colors.primary,
        borderRadius: 8
      },
      selected_month: {
        ...defaultStyles.selected_month,
        backgroundColor: theme.colors.primary,
        borderRadius: 8
      },
      selected_month_label: {
        ...defaultStyles.selected_month_label,
        color: theme.colors.primaryText
      },
      selected_year: {
        ...defaultStyles.selected_year,
        backgroundColor: theme.colors.primary,
        borderRadius: 8
      },
      selected_year_label: {
        ...defaultStyles.selected_year_label,
        color: theme.colors.primaryText
      },
      button_next_image: {
        tintColor: theme.colors.primary
      },
      button_prev_image: {
        tintColor: theme.colors.primary
      }
    }),
    [defaultStyles, theme]
  );

  const renderDay = useCallback(
    (day: CalendarDay) => {
      const dayKey = toCalendarDateKey(day.date);
      const hasHumor = daysWithHumorSet.has(dayKey);
      const labelColor = day.isSelected
        ? theme.colors.primaryText
        : day.isToday
          ? theme.colors.primary
          : day.isCurrentMonth
            ? theme.colors.text
            : theme.colors.textPlaceholder;

      return (
        <View
          style={styles.dayContent}
          pointerEvents="none"
        >
          <Text
            style={[
              styles.dayText,
              { color: labelColor },
              (day.isSelected || day.isToday) && styles.dayTextBold
            ]}
          >
            {day.text}
          </Text>
          {hasHumor ? (
            <View
              style={[
                styles.humorDot,
                {
                  backgroundColor: day.isSelected ? theme.colors.primaryText : theme.colors.primary
                }
              ]}
            />
          ) : (
            <View style={styles.humorDotPlaceholder} />
          )}
        </View>
      );
    },
    [daysWithHumorSet, styles, theme]
  );

  const renderMonthSelector = useCallback(
    ({ text, isOpen, onPress }: CalendarMonthSelectorProps) => (
      <>
        <SyncPickerFocus
          view="month"
          isOpen={isOpen}
          onFocusChange={setPickerFocus}
        />
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={text}
        >
          <Text style={pickerStyles.month_selector_label}>{text}</Text>
        </Pressable>
      </>
    ),
    [pickerStyles.month_selector_label]
  );

  const renderYearSelector = useCallback(
    ({ year, yearRange, isOpen, onPress }: CalendarYearSelectorProps) => (
      <>
        <SyncPickerFocus
          view="year"
          isOpen={isOpen}
          onFocusChange={setPickerFocus}
        />
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={isOpen ? yearRange : year}
        >
          <Text style={pickerStyles.year_selector_label}>{isOpen ? yearRange : year}</Text>
        </Pressable>
      </>
    ),
    [pickerStyles.year_selector_label]
  );

  const renderTimeSelector = useCallback(
    ({ text, isOpen, onPress }: CalendarTimeSelectorProps) => (
      <>
        <SyncPickerFocus
          view="time"
          isOpen={isOpen}
          onFocusChange={setPickerFocus}
        />
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={text}
        >
          <Text style={pickerStyles.time_selector_label}>{text}</Text>
        </Pressable>
      </>
    ),
    [pickerStyles.time_selector_label]
  );

  const pickerComponents = useMemo(
    () => ({
      Day: renderDay,
      MonthSelector: renderMonthSelector,
      YearSelector: renderYearSelector,
      TimeSelector: renderTimeSelector
    }),
    [renderDay, renderMonthSelector, renderYearSelector, renderTimeSelector]
  );

  const handleChange = useCallback(
    ({ date }: { date: DateType }) => {
      const nextDate = toJsDate(date);
      if (!nextDate) return;

      const changeSource = dateChangeSourceRef.current;
      dateChangeSourceRef.current = null;

      const current = draftDateTimeRef.current;
      if (current.getTime() !== nextDate.getTime()) {
        draftDateTimeRef.current = nextDate;
        setDraftDateTime(nextDate);
      }

      const committedDate = withTime ? nextDate : startOfDay(nextDate);

      // Mês/ano atualizam a data global e mantêm o modal aberto.
      if (changeSource === "month" || changeSource === "year") {
        onDateChange?.(committedDate);
        return;
      }

      if (!withTime) {
        onConfirm(committedDate);
      }
    },
    [onConfirm, onDateChange, withTime]
  );

  const handleMonthChange = useCallback(() => {
    dateChangeSourceRef.current = "month";
  }, []);

  const handleYearChange = useCallback(() => {
    dateChangeSourceRef.current = "year";
  }, []);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
          accessibilityLabel="Fechar"
        />

        <View style={styles.sheet}>
          <Text style={styles.title}>{pickerTitle}</Text>

          <View>
            <DateTimePicker
              mode="single"
              date={draftDateTime}
              onChange={handleChange}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              locale="pt-br"
              timePicker={withTime}
              use12Hours={false}
              showOutsideDays
              containerHeight={280}
              styles={pickerStyles}
              weekdaysFormat="short"
              components={pickerComponents}
            />
          </View>

          {withTime && (
            <View style={styles.actions}>
              <Button
                title="Cancelar"
                variant="outlined"
                flex
                onPress={onCancel}
              />
              <Button
                title="Confirmar"
                flex
                onPress={() => onConfirm(draftDateTime)}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.backgroundOverlay,
      justifyContent: "center",
      padding: 24
    },
    sheet: {
      backgroundColor: theme.colors.paper,
      borderRadius: 16,
      padding: 16,
      gap: 12,
      zIndex: 1,
      ...theme.shadows.default
    },
    title: {
      textAlign: "center",
      color: theme.colors.text,
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.body
    },
    dayContent: {
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      paddingVertical: 4,
      width: "100%",
      height: "100%"
    },
    dayText: {
      fontSize: theme.fonts.sizes.body,
      fontFamily: theme.fonts.family.regular
    },
    dayTextBold: {
      fontFamily: theme.fonts.family.bold
    },
    humorDot: {
      width: 5,
      height: 5,
      borderRadius: 3
    },
    humorDotPlaceholder: {
      width: 5,
      height: 5
    },
    actions: {
      flexDirection: "row",
      gap: 8
    }
  });
