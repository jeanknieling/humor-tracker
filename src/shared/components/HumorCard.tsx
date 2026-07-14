import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppTheme } from "./../../../themes/Theme";
import { useTheme } from "./../theme/ThemeContext";
import { formatDateTimeLabel } from "./../utils/date";
import { StarRating } from "./StarRating";

type HumorCardProps = {
  dateTime: number;
  rate: number;
  description: string;
  onPress: () => void;
  selectionMode?: boolean;
  selected?: boolean;
};

export function HumorCard({
  dateTime,
  rate,
  description,
  onPress,
  selectionMode = false,
  selected = false
}: HumorCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
    >
      <View style={styles.contentRow}>
        {selectionMode && (
          <Ionicons
            name={selected ? "checkbox" : "square-outline"}
            size={22}
            color={selected ? theme.colors.primary : theme.colors.textPlaceholder}
            style={styles.checkbox}
          />
        )}
        <View style={styles.content}>
          <Text style={styles.dateTimeText}>{formatDateTimeLabel(dateTime)}</Text>
          <StarRating
            rate={rate}
            align="flex-start"
            touchableOpacityDisabled
            size={24}
          />
          {description ? (
            <Text
              numberOfLines={2}
              style={styles.descriptionText}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.paper,
      padding: 8,
      borderRadius: 8,
      gap: 8,
      borderWidth: 2,
      borderColor: "transparent"
    },
    containerSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.backgroundHighlight
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8
    },
    checkbox: {
      marginTop: 2
    },
    content: {
      flex: 1,
      gap: 8
    },
    dateTimeText: {
      color: theme.colors.textPlaceholder,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body
    },
    descriptionText: {
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body
    }
  });
