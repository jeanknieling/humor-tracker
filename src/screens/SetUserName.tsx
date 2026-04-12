import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { theme } from "./../../themes/Theme";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { TNavigationScreenProps } from "./../Routes";

export const SetUserNamePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('');

  return (
    <View style={{...styles.container, paddingBottom: insets.bottom}}>
      <Text style={styles.title}>Qual é o seu nome?</Text>

      <BaseInput label="Nome">
        <TextInput
          style={styles.input}
          placeholder="Escreva seu nome aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          value={userName}
          onChangeText={(text) => setUserName(text)}
          autoFocus
        />
      </BaseInput>

      <View style={{flex: 1}} />
      
      <Button 
        title="Salvar" 
        onPress={() => navigation.popTo('home', { newName: userName })}
      />
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