import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { useTheme } from "./../shared/theme/ThemeContext";

export const SetUserNamePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem("user-name").then((value) => {
      setUserName(value ?? '');
    });
  }, []);

  const handleSaveUserName = async () => {
    const trimmedName = userName.trim();

    try {
      await AsyncStorage.setItem("user-name", trimmedName);
    } catch (error) {
      Alert.alert("Erro ao salvar o nome do usuário no histórico");
    }

    navigation.popTo('home', { newName: trimmedName });
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
