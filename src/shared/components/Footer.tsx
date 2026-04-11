import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "../../../themes/Theme";

type IFooterProps = {
  children: React.ReactNode;
}

export const Footer = ({ children }: IFooterProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footerContainer, { paddingBottom: insets.bottom + 16}]}>{children}</View>
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