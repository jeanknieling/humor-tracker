import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "./../../../themes/Theme";

type IButtonProps = {
  title?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const Button = ({ title, children, onPress }: IButtonProps) => {
  return (
    <Pressable
    style={({ pressed }) => ({
      ...styles.button,
      ...(pressed && styles.buttonPressed)
    })}
    onPress={onPress}
  >
      {children || <Text style={styles.buttonText}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: theme.colors.primaryText,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
  },
});