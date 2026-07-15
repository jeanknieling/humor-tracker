import Octicons from "@expo/vector-icons/Octicons";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { AppTheme } from "../../../themes/Theme";
import { useTheme } from "../providers/ThemeContext";

const STAR_COUNT = 5;

interface IStarRatingProps {
  rate: number;
  align?: ViewStyle["justifyContent"];
  touchableOpacityDisabled?: boolean;
  onChange?: (rate: number) => void;
  size?: number;
}

export function StarRating({
  rate,
  align = "center",
  touchableOpacityDisabled = false,
  onChange,
  size = 36
}: IStarRatingProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={{
      ...styles.container,
      gap: !touchableOpacityDisabled ? 8 : 0,
      justifyContent: align }} >
      {
        Array.from({ length: STAR_COUNT }).map((_, index) => {
          const starRate = index + 1;
          const filled = starRate <= rate;

          const isFirstFilled = filled && starRate === 1;
          const isLastFilled = filled && starRate === rate;

          return (
            <TouchableOpacity
              key={starRate}
              onPress={() => onChange && onChange(starRate)}
              disabled={touchableOpacityDisabled}
            >
              <Octicons
                name={filled ? "star-fill" : "star"}
                color={
                  filled
                    ? theme.colors.highlight
                    : theme.colors.textPlaceholder
                }
                size={size}
                style={{
                  ...(touchableOpacityDisabled && styles.star),
                  ...(touchableOpacityDisabled && filled && styles.starContainerHighlight),
                  ...(touchableOpacityDisabled && isFirstFilled && styles.starContainerHighlightStart),
                  ...(touchableOpacityDisabled && isLastFilled && styles.starContainerHighlightEnd),
                }}
              />
            </TouchableOpacity>
          );
        })
      }
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    star: {
      padding: 4,
      color: theme.colors.highlight,
    },
    starContainerHighlight: {
      backgroundColor: theme.colors.backgroundHighlight,
    },
    starContainerHighlightStart: {
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
    },
    starContainerHighlightEnd: {
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    },
  });
