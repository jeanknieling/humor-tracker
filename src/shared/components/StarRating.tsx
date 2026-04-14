import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { theme } from "../../../themes/Theme";

interface IStarRatingProps {
  rate: number;
  onChange: (rate: number) => void;
  max?: number;
  size?: number;
};

export function StarRating({
  rate,
  onChange,
  max = 5,
  size = 36,
}: IStarRatingProps) {
  return (
    <View style={[styles.container]} >
      {Array.from({ length: max }).map((_, index) => {
        const starRate = index + 1;
        const filled = starRate <= rate;
        return (
          <TouchableOpacity
            key={starRate}
            onPress={() => onChange(starRate)}
          >
            <Octicons
              name={filled ? "star-fill" : "star"}
              color={filled ? theme.colors.highlight : theme.colors.textPlaceholder}
              size={size}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});