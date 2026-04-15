import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { StarRating } from "./../shared/components/StarRating";

export const DetailPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const { params } = useRoute<TRouteProps<"detail">>();
  const [selectedRate, setSelectedRate] = useState<number>(params.rate);
  const [dateTime, setDateTime] = useState<string>(new Date().toISOString());
  const [description, setDescription] = useState<string>('');
  
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>
          Como está seu humor hoje?
        </Text>
        
        <StarRating rate={selectedRate} onChange={(rate) => setSelectedRate(rate)} />

        <BaseInput 
          label="Data e hora" 
        >
          <TextInput
            style={styles.input}
            placeholder="Escreva seu nome aqui..."
            placeholderTextColor={theme.colors.textPlaceholder}
            value={dateTime}
            onChangeText={setDateTime}
          />
        </BaseInput>

        <BaseInput 
          label="Descreva mais sobre o seu humor" 
        >
          <TextInput
            style={{...styles.input, ...styles.inputMultiline}}
            placeholder="Escreva seu nome aqui..."
            placeholderTextColor={theme.colors.textPlaceholder}
            multiline
            numberOfLines={16}
            value={description}
            onChangeText={setDescription}
          />
        </BaseInput>

        <View style={{flex: 1}}/>

        <View style={{...styles.actionsContainer, paddingBottom: insets.bottom + 16}}>
          {
            params?.id && (
              <Button 
                onPress={() => {}}
                variant="outlined"
                color={theme.colors.error}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={18} 
                  color={theme.colors.error}
                  />
              </Button>
            )
          }
          <Button
            title="Cancelar" 
            onPress={() => navigation.goBack()}
            variant="outlined"
            flex
          />
          <Button 
            title="Salvar" 
            onPress={() => {}}
            flex
          />
        </View>
      </View>
    </>
  );
}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
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
  inputMultiline: {
    height: theme.fonts.sizes.body * 16,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});