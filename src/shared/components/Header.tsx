import { StyleSheet, Text, View } from "react-native";

import { theme } from "./../../../themes/Theme";

type IHeaderProps = {
  userName?: string;
}

export const Header = ({ userName }: IHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Olá, </Text>
      <Text style={[styles.headerText, styles.headerTextBold]}>{userName ? `Seu nome é ${userName}!` : 'Seu nome é?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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