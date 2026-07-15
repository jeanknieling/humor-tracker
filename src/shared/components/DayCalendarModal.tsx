import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  CalendarDay,
  CalendarYearSelectorProps,
  DateType,
  useDefaultStyles
} from "react-native-ui-datepicker";

import { AppTheme } from "./../../../themes/Theme";
import { useTheme } from "./../providers/ThemeContext";
import { startOfDay, toCalendarDateKey } from "./../utils/date";
import { Button } from "./Button";

dayjs.locale("pt-br");

type DayCalendarModalProps = {
  visible: boolean;
  selectedDay: Date;
  daysWithHumor: string[];
  withTime?: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
};

function toJsDate(value: DateType): Date | null {
  if (value == null) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toDate() : null;
}

export function DayCalendarModal({
  visible,
  selectedDay,
  daysWithHumor,
  withTime = false,
  onConfirm,
  onCancel
}: DayCalendarModalProps) {
  const { theme, isDark } = useTheme();
  const defaultStyles = useDefaultStyles(isDark ? "dark" : "light");
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [draftDateTime, setDraftDateTime] = useState(selectedDay);

  const daysWithHumorSet = useMemo(() => new Set(daysWithHumor), [daysWithHumor]);

  useEffect(() => {
    if (visible) {
      setDraftDateTime(selectedDay);
    }
  }, [visible, selectedDay]);

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

  const renderDay = (day: CalendarDay) => {
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
  };

  const renderYearSelector = ({
    year,
    yearRange,
    isOpen,
    onPress
  }: CalendarYearSelectorProps) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isOpen ? yearRange : year}
    >
      <Text style={pickerStyles.year_selector_label}>{isOpen ? yearRange : year}</Text>
    </Pressable>
  );

  const handleChange = ({ date }: { date: DateType }) => {
    const nextDate = toJsDate(date);
    if (!nextDate) return;

    setDraftDateTime((current) => {
      if (current.getTime() === nextDate.getTime()) return current;
      return nextDate;
    });

    if (!withTime) {
      onConfirm(startOfDay(nextDate));
    }
  };

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
          <Text style={styles.title}>{withTime ? "Escolher data e hora" : "Escolher dia"}</Text>

          <View>
            <DateTimePicker
              mode="single"
              date={draftDateTime}
              onChange={handleChange}
              locale="pt-br"
              timePicker={withTime}
              use12Hours={false}
              showOutsideDays
              containerHeight={280}
              styles={pickerStyles}
              weekdaysFormat="short"
              components={{
                Day: renderDay,
                YearSelector: renderYearSelector
              }}
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
