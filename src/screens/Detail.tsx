import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { StarRating } from "./../shared/components/StarRating";
import { loadHumorList, saveHumorList } from "./../shared/storage/appStorage";
import { useTheme } from "./../shared/theme/ThemeContext";
import { IUserHumor } from "./../shared/types/humor";
import {
  buildDateTimeForDay,
  formatDateTimeLabel,
  formatDayLabel,
  isToday
} from "./../shared/utils/date";

export const DetailPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { params } = useRoute<TRouteProps<"detail">>();

  const isEditingExisting = Boolean(params.id);

  const [rate, setRate] = useState(params.rate ?? 1);
  const [dateTime, setDateTime] = useState<Date>(() => buildDateTimeForDay(params.selectedDay));
  const [description, setDescription] = useState("");
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  const pageTitle = isToday(dateTime)
    ? "Como está seu humor hoje?"
    : `Como estava seu humor em ${formatDayLabel(dateTime)}?`;

  const handleSave = async () => {
    const humorToSave: IUserHumor = {
      id: params.id || uuidv4(),
      dateTime: dateTime.getTime(),
      rate,
      description
    };

    try {
      const currentList = await loadHumorList();
      const listWithoutThisHumor = currentList.filter((item) => item.id !== humorToSave.id);
      const updatedList = [humorToSave, ...listWithoutThisHumor];

      await saveHumorList(updatedList);
      navigation.popTo("home");
    } catch {
      Alert.alert("Erro ao salvar o humor no histórico");
    }
  };

  const handleDelete = async () => {
    if (!params.id) return;

    try {
      const currentList = await loadHumorList();
      const updatedList = currentList.filter((item) => item.id !== params.id);
      await saveHumorList(updatedList);
      navigation.popTo("home");
    } catch {
      Alert.alert("Erro ao deletar o humor no histórico");
    }
  };

  const confirmDeleteHumor = () => {
    Alert.alert("Excluir registro", "Tem certeza que deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: handleDelete }
    ]);
  };

  useEffect(() => {
    if (!params.id) return;

    loadHumorList().then((humorList) => {
      const humor = humorList.find((item) => item.id === params.id);
      if (!humor) return;

      setDateTime(new Date(humor.dateTime));
      setRate(humor.rate);
      setDescription(humor.description);
    });
  }, [params.id]);

  return (
    <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
      <Text style={styles.title}>{pageTitle}</Text>

      <StarRating
        rate={rate}
        onChange={setRate}
      />

      <BaseInput
        label="Data e hora"
        asButton
        onPress={() => setIsDateTimePickerVisible(true)}
      >
        <TextInput
          style={styles.input}
          placeholder="Selecione a data e hora aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          editable={false}
          pointerEvents="none"
          value={formatDateTimeLabel(dateTime)}
        />
      </BaseInput>

      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        date={dateTime}
        isDarkModeEnabled={isDark}
        onConfirm={(date) => {
          setDateTime(date);
          setIsDateTimePickerVisible(false);
        }}
        onCancel={() => setIsDateTimePickerVisible(false)}
      />

      <BaseInput label="Descreva mais sobre o seu humor">
        <TextInput
          style={{ ...styles.input, ...styles.inputMultiline }}
          placeholder="Escreva uma descrição aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          multiline
          numberOfLines={16}
          value={description}
          onChangeText={setDescription}
        />
      </BaseInput>

      <View style={{ flex: 1 }} />

      <View style={styles.actionsContainer}>
        {isEditingExisting && (
          <Button
            onPress={confirmDeleteHumor}
            variant="outlined"
            color={theme.colors.error}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color={theme.colors.error}
            />
          </Button>
        )}
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
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16
    },
    title: {
      textAlign: "center",
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body
    },
    input: {
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      padding: 12
    },
    inputMultiline: {
      height: theme.fonts.sizes.body * 16,
      textAlignVertical: "top"
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8
    }
  });
