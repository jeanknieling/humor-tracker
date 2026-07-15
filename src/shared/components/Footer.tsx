import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTheme } from "../../../themes/Theme";
import { useTheme } from "../providers/ThemeContext";

interface IFooterProps {
  isFocused: boolean;
  children: React.ReactNode;
}

export const Footer = ({ children, isFocused }: IFooterProps) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View 
      style={{
        ...styles.footerContainer, paddingBottom: insets.bottom + 16,
        ...{ opacity:  isFocused ? 1 : 0 },
      }}>
        {children}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    footerContainer: {
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: theme.colors.paper,
      ...theme.shadows.default,
    },
  });
