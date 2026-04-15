import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "../../../themes/Theme";

interface IFooterProps {
  isFocused: boolean;
  children: React.ReactNode;
}

export const Footer = ({ children, isFocused }: IFooterProps) => {
  const insets = useSafeAreaInsets();

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

const styles = StyleSheet.create({
  footerContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: theme.colors.paper,
    ...theme.shadows.default,
  },
});