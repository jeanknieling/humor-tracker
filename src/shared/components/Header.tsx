import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "./../../../themes/Theme";

type IHeaderProps = {
  userName?: string;
  actions?: ReactNode;
};

export const Header = ({ userName, actions }: IHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.headerText}>Olá, </Text>
        <Text style={[styles.headerText, styles.headerTextBold]}>
          {userName ? `${userName}!` : "Seu nome é?"}
        </Text>
      </View>
      {actions ? (
        <View style={styles.headerActions}>{actions}</View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    minHeight: 56,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  headerText: {
    fontSize: theme.fonts.sizes.title,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.text,
  },
  headerTextBold: {
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.primary,
  },
});