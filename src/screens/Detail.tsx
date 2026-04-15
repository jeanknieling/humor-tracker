import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);

  return (
    <View style={{...styles.container, paddingBottom: insets.bottom}}>
      <Text style={styles.title}>
        Como está seu humor hoje?
      </Text>
      
      <StarRating rate={selectedRate} onChange={(rate) => setSelectedRate(rate)} />

      <BaseInput 
        label="Data e hora" 
        asButton
        onPress={() => setShowDateTimePicker(true)}
      >
        <TextInput
          style={styles.input}
          placeholder="Selecione a data e hora aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          editable={false}
          pointerEvents="none"
          value={dateTime.toLocaleString('pt-BR')}

        />
      </BaseInput>
      <DateTimePickerModal
      isVisible={showDateTimePicker}
      mode="datetime"
      date={dateTime}
      onConfirm={(date) => {
        setDateTime(date)
        setShowDateTimePicker(false)
      }}
      onCancel={() => setShowDateTimePicker(false)}
    />

      <BaseInput 
        label="Descreva mais sobre o seu humor" 
      >
        <TextInput
          style={{...styles.input, ...styles.inputMultiline}}
          placeholder="Escreva uma descrição aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          multiline
          numberOfLines={16}
          value={description}
          onChangeText={setDescription}
        />
      </BaseInput>

      <View style={{flex: 1}}/>

      <View style={styles.actionsContainer}>
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