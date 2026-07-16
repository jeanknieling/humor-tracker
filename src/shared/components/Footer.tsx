import { type ReactNode, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTheme } from "../../../themes/Theme";
import { useTheme } from "../providers/ThemeContext";

interface IFooterProps {
  isFocused: boolean;
  children: ReactNode;
  includeBottomInset?: boolean;
}

export const Footer = ({
  children,
  isFocused,
  includeBottomInset = true
}: IFooterProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={{
        ...styles.footerContainer,
        paddingBottom: includeBottomInset ? insets.bottom + 16 : 16,
        opacity: isFocused ? 1 : 0
      }}
    >
      {children}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    footerContainer: {
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderTopWidth: 5,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.colors.background,
      backgroundColor: theme.colors.paper
    }
  });
