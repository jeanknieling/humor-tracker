import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "./../../themes/Theme";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";

export const SetUserNamePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual é o seu nome?</Text>

      <BaseInput label="Nome">
        <TextInput
          style={styles.input}
          placeholder="Escreva seu nome aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          autoFocus
        />
      </BaseInput>

      <View style={{flex: 1}} />
      
      <Button title="Salvar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
  },
  input: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
    padding: 12,
  },
});