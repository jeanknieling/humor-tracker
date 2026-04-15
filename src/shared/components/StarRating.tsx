import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { theme } from "../../../themes/Theme";

interface IStarRatingProps {
  rate: number;
  align?: ViewStyle['justifyContent'];
  touchableOpacityDisabled?: boolean;
  onChange?: (rate: number) => void;
  max?: number;
  size?: number;
};

export function StarRating({
  rate,
  align = 'center',
  touchableOpacityDisabled = false,
  onChange,
  max = 5,
  size = 36,
}: IStarRatingProps) {
  return (
    <View style={{
      ...styles.container,
      gap: !touchableOpacityDisabled ? 8 : 0,
      justifyContent: align }} >
      {
        Array.from({ length: max }).map((_, index) => {
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

const styles = StyleSheet.create({
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