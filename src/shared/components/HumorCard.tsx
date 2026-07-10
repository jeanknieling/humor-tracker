import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { AppTheme } from "./../../../themes/Theme";
import { useTheme } from "./../theme/ThemeContext";
import { StarRating } from "./StarRating";

interface IHumorCardProps {
  dateTime: number;
  rate: number;
  description: string;
  onPress: () => void;
};

export function HumorCard({dateTime, rate, description, onPress}: IHumorCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text 
        style={styles.dateTimeText}>{
          new Date(dateTime).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(',', ' às')
        }
      </Text>
      <StarRating 
        rate={rate} 
        align="flex-start" 
        touchableOpacityDisabled 
        size={24}
      />
      {
        description && (
          <Text 
            numberOfLines={2} 
            style={styles.descriptionText}
          >
            {description}
          </Text>
        )
      }
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
    },
    dateTimeText: {
      color: theme.colors.textPlaceholder,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
    },
    descriptionText: {
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
    },
  });
