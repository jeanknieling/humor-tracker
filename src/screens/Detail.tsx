import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from 'uuid';

import { theme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { StarRating } from "./../shared/components/StarRating";
import { IUserHumor } from './Home';

export const DetailPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const { params } = useRoute<TRouteProps<"detail">>();
  const [selectedRate, setSelectedRate] = useState<number>(params.rate || 1);
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>('');
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);

  const handleSave = async () => {
    const newHumorOrUpdate: IUserHumor = {
      id: params.id || uuidv4(),
      dateTime: dateTime.getTime(),
      rate: selectedRate,
      description,
    };
  
    try {
      const oldUserHumorList: IUserHumor[] = await AsyncStorage
        .getItem("humor-list")
        .then((value) => (value ? JSON.parse(value) : []));
  
      const humorIndex = oldUserHumorList.findIndex(
        (item) => item.id === newHumorOrUpdate.id
      );
  
      let updatedList: IUserHumor[];
  
      if (humorIndex === -1) {
        updatedList = [newHumorOrUpdate, ...oldUserHumorList];
      } else {
        const listWithoutUpdatedItem = oldUserHumorList.filter((item) => item.id !== newHumorOrUpdate.id);
        updatedList = [newHumorOrUpdate, ...listWithoutUpdatedItem];
      }
  
      await AsyncStorage.setItem("humor-list", JSON.stringify(updatedList));
  
      navigation.popTo("home");
    } catch (error) {
      Alert.alert("Erro ao salvar o humor no histórico");
    }
  };

  const handleDelete = async () => {
    try {
      const userHumorList: IUserHumor[] = await AsyncStorage
        .getItem("humor-list")
        .then((value) => (value ? JSON.parse(value) : []));
  
      const updatedList = userHumorList.filter((item) => item.id !== params.id);
  
      await AsyncStorage.setItem("humor-list", JSON.stringify(updatedList));
  
      navigation.popTo("home");
    } catch (error) {
      Alert.alert("Erro ao deletar o humor no histórico");
    }
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      "Excluir registro",
      "Tem certeza que deseja excluir este registro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  };

  useEffect(() => {
    if (params.id) {
      AsyncStorage
        .getItem("humor-list")
        .then((value) => value ? JSON.parse(value) : [])
        .then((humorList) => {
          const humor = humorList.find((item: IUserHumor) => item.id === params.id);
          if (!humor) return;

          setDateTime(new Date(humor.dateTime));
          setSelectedRate(humor.rate);
          setDescription(humor.description);
        });
    }
  }, [params.id]);

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
          value={
            dateTime.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).replace(',', ' às')
          }
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
              onPress={handleConfirmDelete}
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
          onPress={handleSave}
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