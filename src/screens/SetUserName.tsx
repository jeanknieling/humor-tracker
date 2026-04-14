import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { theme } from "./../../themes/Theme";
import { TNavigationScreenProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";

export const SetUserNamePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem("user-name").then((value) => {
      setUserName(value ?? '');
    });
  }, []);

  const handleSaveUserName = async () => {
    try {
      
      await AsyncStorage.setItem("user-name", userName);
    } catch (error) {
      Alert.alert("Erro ao recuperar o nome do usuário");
    }

    navigation.popTo('home', { newName: userName });
  }

  

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
        onPress={handleSaveUserName}
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