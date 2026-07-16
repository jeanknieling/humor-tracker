import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Button } from "./../shared/components/Button";
import { DayCalendarModal } from "./../shared/components/DayCalendarModal";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";
import { HumorCard } from "./../shared/components/HumorCard";
import { OptionsMenu } from "./../shared/components/OptionsMenu";
import { StarRating } from "./../shared/components/StarRating";
import { useHumorSelection } from "./../shared/hooks/useHumorSelection";
import { useSelectedDay } from "./../shared/providers/SelectedDayContext";
import { useTheme } from "./../shared/providers/ThemeContext";
import { loadHumorList, loadUserName, saveHumorList } from "./../shared/storage/appStorage";
import {
  BulkDeleteScope,
  HumorSortDirection,
  HumorSortField,
  IUserHumor
} from "./../shared/types/humor";
import {
  formatDayLabel,
  formatHumorQuestion,
  getDaysWithHumorKeys,
  isSameDay,
  isToday
} from "./../shared/utils/date";
import { sortHumorList } from "./../shared/utils/humorSort";

export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { theme } = useTheme();
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isScreenFocused = useIsFocused();

  const [userName, setUserName] = useState("");
  const [allHumors, setAllHumors] = useState<IUserHumor[]>([]);
  const [isDayPickerVisible, setIsDayPickerVisible] = useState(false);
  const [draftRate, setDraftRate] = useState(0);
  const [sortField, setSortField] = useState<HumorSortField>("dateTime");
  const [sortDirection, setSortDirection] = useState<HumorSortDirection>("desc");
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [bulkDeleteScope, setBulkDeleteScope] = useState<BulkDeleteScope | null>(null);

  const isSelectionMode = bulkDeleteScope != null;
  const hasUserName = Boolean(userName.trim());
  const showCalendar = hasUserName && !isSelectionMode;
  const showOptionsButton = hasUserName;

  const humorsForSelectedDay = useMemo(
    () => allHumors.filter((humor) => isSameDay(new Date(humor.dateTime), selectedDay)),
    [allHumors, selectedDay]
  );

  const daysWithHumor = useMemo(() => getDaysWithHumorKeys(allHumors), [allHumors]);

  const visibleHumorList = bulkDeleteScope === "all" ? allHumors : humorsForSelectedDay;
  const visibleIds = useMemo(
    () => visibleHumorList.map((humor) => humor.id),
    [visibleHumorList]
  );
  const {
    selectedHumorIds,
    clearSelection,
    toggleHumorSelection,
    toggleSelectAllVisible,
    areAllVisibleSelected,
    confirmDeleteSelected
  } = useHumorSelection(visibleIds);

  const sortedVisibleHumors = useMemo(
    () => sortHumorList(visibleHumorList, sortField, sortDirection),
    [visibleHumorList, sortField, sortDirection]
  );

  const canSort = visibleHumorList.length > 1;
  const hasHumorsOnSelectedDay = humorsForSelectedDay.length > 0;
  const hasAnyHumors = allHumors.length > 0;
  const selectedDayNumber = selectedDay.getDate();
  const selectedDayLabel = formatDayLabel(selectedDay);

  const exitSelectionMode = () => {
    setBulkDeleteScope(null);
    clearSelection();
  };

  const persistHumorList = async (nextList: IUserHumor[]) => {
    await saveHumorList(nextList);
    setAllHumors(nextList);
  };

  const enterSelectionMode = (scope: BulkDeleteScope) => {
    setIsOptionsMenuOpen(false);
    setBulkDeleteScope(scope);
    clearSelection();
  };

  const handleStartBulkDelete = () => {
    Alert.alert("Excluir registros", "Quais cards deseja selecionar para excluir?", [
      { text: "Cancelar", style: "cancel" },
      ...(hasHumorsOnSelectedDay
        ? [
            {
              text: `Do dia (${selectedDayLabel})`,
              onPress: () => enterSelectionMode("day")
            }
          ]
        : []),
      {
        text: "Todos os cards",
        onPress: () => enterSelectionMode("all")
      }
    ]);
  };

  const handleDeleteSelectedHumors = () => {
    confirmDeleteSelected(async (ids) => {
      const idsToDelete = new Set(ids);
      const remainingHumors = allHumors.filter((humor) => !idsToDelete.has(humor.id));
      await persistHumorList(remainingHumors);
      exitSelectionMode();
    });
  };

  useFocusEffect(
    useCallback(() => {
      setDraftRate(0);

      loadUserName()
        .then(setUserName)
        .catch(() => setUserName(""));

      loadHumorList()
        .then(setAllHumors)
        .catch(() => setAllHumors([]));
    }, [])
  );

  return (
    <>
      {!isScreenFocused && (
        <Pressable
          accessibilityLabel="Fechar"
          onPress={() => navigation.goBack()}
          style={[styles.sheetOverlay, { backgroundColor: theme.colors.backgroundOverlay }]}
        />
      )}

      <Header
        userName={userName.trim() || undefined}
        selectedDayNumber={showCalendar ? selectedDayNumber : undefined}
        onPressCalendar={showCalendar ? () => setIsDayPickerVisible(true) : undefined}
        actions={
          showOptionsButton ? (
            <Pressable
              onPress={() => setIsOptionsMenuOpen(true)}
              hitSlop={12}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={theme.colors.text}
              />
            </Pressable>
          ) : undefined
        }
      />

      {isSelectionMode && (
        <Pressable
          style={styles.selectAllRow}
          onPress={toggleSelectAllVisible}
        >
          <Ionicons
            name={areAllVisibleSelected ? "checkbox" : "square-outline"}
            size={22}
            color={areAllVisibleSelected ? theme.colors.primary : theme.colors.textPlaceholder}
          />
          <Text style={styles.selectAllLabel}>Selecionar todos</Text>
        </Pressable>
      )}

      <DayCalendarModal
        visible={isDayPickerVisible}
        selectedDay={selectedDay}
        daysWithHumor={daysWithHumor}
        onDateChange={setSelectedDay}
        onConfirm={(date) => {
          setSelectedDay(date);
          setIsDayPickerVisible(false);
        }}
        onCancel={() => setIsDayPickerVisible(false)}
      />

      <OptionsMenu
        visible={isOptionsMenuOpen}
        onClose={() => setIsOptionsMenuOpen(false)}
        listActions={{
          canSort,
          sortField,
          sortDirection,
          onSortChange: (field, direction) => {
            setSortField(field);
            setSortDirection(direction);
          },
          canBulkDelete: hasAnyHumors && !isSelectionMode,
          onBulkDelete: handleStartBulkDelete
        }}
      />

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={sortedVisibleHumors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isHumorSelected = selectedHumorIds.includes(item.id);

          return (
            <HumorCard
              dateTime={item.dateTime}
              rate={item.rate}
              description={item.description}
              selectionMode={isSelectionMode}
              selected={isHumorSelected}
              onPress={() => {
                if (isSelectionMode) {
                  toggleHumorSelection(item.id);
                  return;
                }
                navigation.navigate("detail", { id: item.id });
              }}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              {isToday(selectedDay) ? (
                <>
                  Nenhum humor {"\n"}
                  registrado para hoje.
                </>
              ) : (
                <>
                  Nenhum humor {"\n"}
                  registrado em {selectedDayLabel}.
                </>
              )}
            </Text>
          </View>
        )}
      />

      <Footer isFocused={isScreenFocused}>
        {isSelectionMode ? (
          <View style={styles.selectionFooter}>
            <Button
              title="Cancelar"
              variant="outlined"
              flex
              onPress={exitSelectionMode}
            />
            <Button
              title={
                selectedHumorIds.length > 0 ? `Excluir (${selectedHumorIds.length})` : "Excluir"
              }
              flex
              variant="outlined"
              color={theme.colors.error}
              onPress={selectedHumorIds.length > 0 ? handleDeleteSelectedHumors : undefined}
            />
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Text style={styles.footerTitle}>
              {!hasUserName ? "Qual é o seu nome?" : formatHumorQuestion(selectedDay)}
            </Text>
            {!hasUserName ? (
              <BaseInput
                label="Nome"
                asButton
                onPress={() => navigation.navigate("setUserName")}
              >
                <TextInput
                  style={styles.footerInput}
                  placeholder="Escreva seu nome aqui..."
                  placeholderTextColor={theme.colors.textPlaceholder}
                  editable={false}
                />
              </BaseInput>
            ) : (
              <StarRating
                rate={draftRate}
                onChange={(rate) => {
                  setDraftRate(rate);
                  navigation.navigate("detail", {
                    rate,
                    selectedDay: selectedDay.getTime()
                  });
                }}
              />
            )}
          </View>
        )}
      </Footer>
    </>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    sheetOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10
    },
    selectAllRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingLeft: 24,
      paddingRight: 16,
      paddingBottom: 8
    },
    selectAllLabel: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text
    },
    listContainer: {
      padding: 16,
      gap: 8,
      flexGrow: 1
    },
    emptyListContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    emptyListText: {
      color: theme.colors.textPlaceholder,
      fontFamily: theme.fonts.family.italic,
      fontSize: theme.fonts.sizes.subtitle,
      textAlign: "center"
    },
    footerContainer: {
      gap: 16
    },
    selectionFooter: {
      flexDirection: "row",
      gap: 8
    },
    footerTitle: {
      textAlign: "center",
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body
    },
    footerInput: {
      color: theme.colors.text,
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      padding: 12
    }
  });
