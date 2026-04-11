import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../../themes/Theme";
import { BaseInput } from "../shared/components/BaseInput";
import { TNavigationScreenProps } from "./../Routes";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";


export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <>
      <Header userName="John Doe" />

      <View style={{flex: 1}} />

      <Footer>
        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>Qual é o seu nome?</Text>
          <BaseInput 
            label="Nome" 
            asButton
            onPress={() => navigation.navigate('setUserName')}
          >
            <TextInput
              style={styles.footerInput}
              placeholder="Escreva seu nome aqui..."
              placeholderTextColor={theme.colors.textPlaceholder}
              pointerEvents="none"
              editable={false}
            />
          </BaseInput>
        </View>
      </Footer>
    </>
  );
}

  const styles = StyleSheet.create({
  footerContainer: {
    gap: 16,
  },
  footerTitle: {
    textAlign: 'center',
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
  },
  footerInput: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
    padding: 12,
  },
});