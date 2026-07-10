import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppTheme } from "../../../themes/Theme";
import { useTheme } from "../theme/ThemeContext";

type IBaseInputProps = {
  children: React.ReactNode;
  label: string;
  asButton?: boolean;
  onPress?: () => void;
  onChangeText?: (text: string) => string;
}

export const BaseInput = ({ children, label, asButton, onPress }: IBaseInputProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.baseInputContainer}>
      <Text style={styles.label}>{label}</Text>
      
      {asButton ? (
        <Pressable 
          style={({ pressed }) => pressed ? [styles.baseInput, styles.baseInputPressed] : styles.baseInput}
          onPress={onPress}
        >
          {children}
        </Pressable>
      ) : (
        <View 
          style={styles.baseInput}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    baseInputContainer: {
      gap: 4,
    },
    label: {
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
    },
    baseInput: {
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    baseInputPressed: {
      opacity: 0.5,
    },
  });
