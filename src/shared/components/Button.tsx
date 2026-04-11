import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "./../../../themes/Theme";

type IButtonProps = {
  title?: string;
  children?: React.ReactNode;
}

export const Button = ({ title, children }: IButtonProps) => {
  return (
    <Pressable 
       style={({ pressed }) => pressed ? [styles.button, styles.buttonPressed] : styles.button}>
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