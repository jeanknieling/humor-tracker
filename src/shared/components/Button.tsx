import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "./../../../themes/Theme";

type IButtonProps = {
  title?: string;
  flex?: boolean;
  color?: string;
  variant?: 'contained' | 'outlined';
  onPress?: () => void;
  children?: React.ReactNode;
}

export const Button = ({ title, children, flex, color, variant = 'contained', onPress }: IButtonProps) => {
  return (
    <Pressable
    style={({ pressed }) => ({
      ...styles.button,
      ...(flex && { flex: 1 }),
      ...(variant === 'contained' ? styles.buttonContained : styles.buttonOutlined),
      ...(pressed && styles.buttonPressed),
      ...(color && { borderColor: color }),
    })}
    onPress={onPress}
  >
      {
      children || (
        <Text 
          style={
            variant === 'contained' ? styles.buttonText : { ...styles.buttonText, ...styles.buttonOutlinedText}
          }
        >
          {title}
        </Text>
      )
      }
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
  buttonContained: {
    backgroundColor: theme.colors.primary,
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.primaryText,
    fontFamily: theme.fonts.family.bold,
    fontSize: theme.fonts.sizes.body,
  },
  buttonOutlinedText: {
    color: theme.colors.primary,
  },
});