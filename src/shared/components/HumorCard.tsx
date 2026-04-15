import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "./../../../themes/Theme";
import { StarRating } from "./StarRating";

interface IHumorCardProps {
  dateTime: string;
  rate: number;
  description: string;
};

export function HumorCard({dateTime, rate, description}: IHumorCardProps) {
  return (
    <View style={styles.container} >
      <Text style={styles.dateTimeText}>{dateTime}</Text>
        <StarRating 
        rate={rate} 
        align="flex-start" 
        touchableOpacityDisabled 
        size={24}
        />
        <Text>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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