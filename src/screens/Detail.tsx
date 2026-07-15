import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { DayCalendarModal } from "./../shared/components/DayCalendarModal";
import { StarRating } from "./../shared/components/StarRating";
import { loadHumorList, saveHumorList } from "./../shared/storage/appStorage";
import { useSelectedDay } from "./../shared/providers/SelectedDayContext";
import { useTheme } from "./../shared/providers/ThemeContext";
import { IUserHumor } from "./../shared/types/humor";
import {
  buildDateTimeForDay,
  formatDateTimeLabel,
  formatHumorQuestion,
  isSameDay,
  startOfDay,
  toCalendarDateKey
} from "./../shared/utils/date";

export const DetailPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { params } = useRoute<TRouteProps<"detail">>();

  const isEditingExisting = Boolean(params.id);

  const [rate, setRate] = useState(params.rate ?? 1);
  const [dateTime, setDateTime] = useState<Date>(() => buildDateTimeForDay(params.selectedDay));
  const [description, setDescription] = useState("");
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [daysWithHumor, setDaysWithHumor] = useState<string[]>([]);
  const descriptionInputRef = useRef<TextInput>(null);
  const dayWhenOpenedRef = useRef(startOfDay(selectedDay));
  const originalDateTimeRef = useRef<Date | null>(null);
  const didSaveRef = useRef(false);

  const trimmedDescription = description.trim();
  const canSave = trimmedDescription.length > 0;

  const pageTitle = formatHumorQuestion(dateTime);

  const handleSave = async () => {
    if (!canSave) {
      Alert.alert("Descrição obrigatória", "Escreva uma descrição antes de salvar.", [
        {
          text: "OK",
          onPress: () => descriptionInputRef.current?.focus()
        }
      ]);
      return;
    }

    const dayChangedWhileEditing =
      isEditingExisting &&
      originalDateTimeRef.current != null &&
      !isSameDay(dateTime, originalDateTimeRef.current);

    const humorToSave: IUserHumor = {
      id: dayChangedWhileEditing || !params.id ? uuidv4() : params.id,
      dateTime: dateTime.getTime(),
      rate,
      description: trimmedDescription
    };

    try {
      const currentList = await loadHumorList();
      const listWithoutReplaced =
        dayChangedWhileEditing || !params.id
          ? currentList
          : currentList.filter((item) => item.id !== params.id);
      const updatedList = [humorToSave, ...listWithoutReplaced];

      await saveHumorList(updatedList);
      didSaveRef.current = true;
      setSelectedDay(dateTime);
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
      didSaveRef.current = true;
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
    dayWhenOpenedRef.current = startOfDay(selectedDay);
    didSaveRef.current = false;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      if (!didSaveRef.current) {
        setSelectedDay(dayWhenOpenedRef.current);
      }
    });

    return unsubscribe;
  }, [navigation, setSelectedDay]);

  useEffect(() => {
    loadHumorList().then((humorList) => {
      const dayKeys = new Set<string>();
      for (const humor of humorList) {
        dayKeys.add(toCalendarDateKey(humor.dateTime));
      }
      setDaysWithHumor([...dayKeys]);

      if (!params.id) return;

      const humor = humorList.find((item) => item.id === params.id);
      if (!humor) return;

      const humorDate = new Date(humor.dateTime);
      setDateTime(humorDate);
      setRate(humor.rate);
      setDescription(humor.description);
      setSelectedDay(humorDate);
      dayWhenOpenedRef.current = startOfDay(humorDate);
      originalDateTimeRef.current = humorDate;
    });
  }, [params.id, setSelectedDay]);

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
        onPress={() => setIsDayPickerVisible(true)}
      >
        <TextInput
          style={styles.input}
          placeholder="Selecione a data aqui..."
          placeholderTextColor={theme.colors.textPlaceholder}
          editable={false}
          pointerEvents="none"
          value={formatDateTimeLabel(dateTime)}
        />
      </BaseInput>

      <DayCalendarModal
        visible={isDayPickerVisible}
        selectedDay={dateTime}
        daysWithHumor={daysWithHumor}
        withTime
        onConfirm={(nextDateTime) => {
          setDateTime(nextDateTime);
          setSelectedDay(nextDateTime);
          setIsDayPickerVisible(false);
        }}
        onCancel={() => setIsDayPickerVisible(false)}
      />

      <BaseInput label="Descreva mais sobre o seu humor">
        <TextInput
          ref={descriptionInputRef}
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
