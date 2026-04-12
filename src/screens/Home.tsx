import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../../themes/Theme";
import { BaseInput } from "../shared/components/BaseInput";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";


export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"home">>();
  const [userName, setUserName] = useState<string | undefined>(params?.newName);

  useEffect(() => {
    if(params?.newName.trim()) setUserName(params?.newName);
  }, [params?.newName]);

  return (
    <>
      <Header userName={userName} />

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