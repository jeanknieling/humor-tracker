import Ionicons from "@expo/vector-icons/Ionicons";
import { ReactNode, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppTheme } from "./../../../themes/Theme";
import { useTheme } from "./../providers/ThemeContext";

type HeaderProps = {
  userName?: string;
  selectedDayNumber?: number;
  onPressCalendar?: () => void;
  actions?: ReactNode;
};

export const Header = ({ userName, selectedDayNumber, onPressCalendar, actions }: HeaderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const showCalendar = selectedDayNumber != null && onPressCalendar != null;
  const hasTrailingActions = Boolean(actions);
  const hasAnySideActions = showCalendar || hasTrailingActions;
  const hasBothSideActions = showCalendar && hasTrailingActions;

  return (
    <View style={styles.headerContainer}>
      {showCalendar ? (
        <View style={styles.calendarSlot}>
          <Pressable
            onPress={onPressCalendar}
            style={styles.calendarButton}
            accessibilityLabel={`Calendário, dia ${selectedDayNumber}`}
          >
            <View style={styles.calendarIconWrap}>
              <Ionicons
                name="calendar-clear-outline"
                size={30}
                color={theme.colors.text}
              />
              <Text style={styles.calendarDayText}>{selectedDayNumber}</Text>
            </View>
          </Pressable>
        </View>
      ) : null}

      <View
        style={[
          styles.headerContent,
          hasAnySideActions && styles.headerContentWithActions,
          hasBothSideActions && styles.headerContentWithBothActions
        ]}
      >
        <Text
          style={styles.headerText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Olá,{" "}
          <Text style={styles.headerTextBold}>{userName ? `${userName}!` : "Seu nome é?"}</Text>
        </Text>
      </View>

      {hasTrailingActions ? <View style={styles.headerActions}>{actions}</View> : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerContainer: {
      padding: 16,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      minHeight: 56
    },
    headerContent: {
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center"
    },
    headerContentWithActions: {
      paddingHorizontal: 32
    },
    headerContentWithBothActions: {
      paddingHorizontal: 48
    },
    calendarSlot: {
      position: "absolute",
      left: 8,
      top: 0,
      bottom: 0,
      justifyContent: "center"
    },
    calendarButton: {
      paddingHorizontal: 8,
      paddingVertical: 4
    },
    calendarIconWrap: {
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center"
    },
    calendarDayText: {
      position: "absolute",
      top: 12,
      fontFamily: theme.fonts.family.bold,
      fontSize: 14,
      color: theme.colors.primary,
      lineHeight: 15
    },
    headerActions: {
      position: "absolute",
      right: 8,
      top: 0,
      bottom: 0,
      justifyContent: "center"
    },
    headerText: {
      fontSize: theme.fonts.sizes.title,
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.text,
      textAlign: "center"
    },
    headerTextBold: {
      fontFamily: theme.fonts.family.bold,
      color: theme.colors.primary
    }
  });
