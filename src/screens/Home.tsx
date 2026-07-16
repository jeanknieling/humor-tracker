import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
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
import { StarRating } from "./../shared/components/StarRating";
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

function sortHumorList(
  list: IUserHumor[],
  field: HumorSortField,
  direction: HumorSortDirection
): IUserHumor[] {
  const sorted = [...list];

  sorted.sort((a, b) => {
    if (field === "dateTime") {
      return direction === "desc" ? b.dateTime - a.dateTime : a.dateTime - b.dateTime;
    }

    if (field === "rate") {
      return direction === "desc" ? b.rate - a.rate : a.rate - b.rate;
    }

    const descriptionCompare = a.description.localeCompare(b.description, "pt-BR", {
      sensitivity: "base"
    });
    return direction === "desc" ? -descriptionCompare : descriptionCompare;
  });

  return sorted;
}

const SORT_OPTIONS: { field: HumorSortField; direction: HumorSortDirection; label: string }[] = [
  { field: "dateTime", direction: "desc", label: "Data (mais recente)" },
  { field: "dateTime", direction: "asc", label: "Data (mais antiga)" },
  { field: "rate", direction: "desc", label: "Nota (maior primeiro)" },
  { field: "rate", direction: "asc", label: "Nota (menor primeiro)" },
  { field: "description", direction: "asc", label: "Descrição (A–Z)" },
  { field: "description", direction: "desc", label: "Descrição (Z–A)" }
];

export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { theme, isDark, toggleTheme } = useTheme();
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
  const [isSortSubmenuOpen, setIsSortSubmenuOpen] = useState(false);
  const [bulkDeleteScope, setBulkDeleteScope] = useState<BulkDeleteScope | null>(null);
  const [selectedHumorIds, setSelectedHumorIds] = useState<string[]>([]);

  const isSelectionMode = bulkDeleteScope != null;
  const hasUserName = Boolean(userName.trim());
  const showHeaderActions = hasUserName && !isSelectionMode;

  const humorsForSelectedDay = useMemo(
    () => allHumors.filter((humor) => isSameDay(new Date(humor.dateTime), selectedDay)),
    [allHumors, selectedDay]
  );

  const daysWithHumor = useMemo(() => getDaysWithHumorKeys(allHumors), [allHumors]);

  const visibleHumorList = bulkDeleteScope === "all" ? allHumors : humorsForSelectedDay;
  const sortedVisibleHumors = useMemo(
    () => sortHumorList(visibleHumorList, sortField, sortDirection),
    [visibleHumorList, sortField, sortDirection]
  );

  const canSort = visibleHumorList.length > 1;
  const hasHumorsOnSelectedDay = humorsForSelectedDay.length > 0;
  const hasAnyHumors = allHumors.length > 0;
  const selectedDayNumber = selectedDay.getDate();
  const selectedDayLabel = formatDayLabel(selectedDay);
  const areAllVisibleSelected =
    visibleHumorList.length > 0 &&
    visibleHumorList.every((humor) => selectedHumorIds.includes(humor.id));

  const closeOptionsMenu = () => {
    setIsOptionsMenuOpen(false);
    setIsSortSubmenuOpen(false);
  };

  const exitSelectionMode = () => {
    setBulkDeleteScope(null);
    setSelectedHumorIds([]);
  };

  const persistHumorList = async (nextList: IUserHumor[]) => {
    await saveHumorList(nextList);
    setAllHumors(nextList);
  };

  const enterSelectionMode = (scope: BulkDeleteScope) => {
    closeOptionsMenu();
    setBulkDeleteScope(scope);
    setSelectedHumorIds([]);
  };

  const handleStartBulkDelete = () => {
    closeOptionsMenu();
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

  const toggleHumorSelection = (id: string) => {
    setSelectedHumorIds((currentIds) =>
      currentIds.includes(id) ? currentIds.filter((itemId) => itemId !== id) : [...currentIds, id]
    );
  };

  const toggleSelectAllVisible = () => {
    if (areAllVisibleSelected) {
      setSelectedHumorIds([]);
      return;
    }
    setSelectedHumorIds(visibleHumorList.map((humor) => humor.id));
  };

  const handleDeleteSelectedHumors = () => {
    if (selectedHumorIds.length === 0) return;

    const selectedCount = selectedHumorIds.length;

    Alert.alert(
      "Excluir selecionados",
      `Tem certeza que deseja excluir ${selectedCount} registro${selectedCount > 1 ? "s" : ""}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const idsToDelete = new Set(selectedHumorIds);
              const remainingHumors = allHumors.filter((humor) => !idsToDelete.has(humor.id));
              await persistHumorList(remainingHumors);
              exitSelectionMode();
            } catch {
              Alert.alert("Erro ao excluir os registros de humor");
            }
          }
        }
      ]
    );
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
        selectedDayNumber={showHeaderActions ? selectedDayNumber : undefined}
        onPressCalendar={showHeaderActions ? () => setIsDayPickerVisible(true) : undefined}
        actions={
          showHeaderActions ? (
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

      <Modal
        visible={isOptionsMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeOptionsMenu}
      >
        <TouchableWithoutFeedback onPress={closeOptionsMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Opções</Text>
                <Pressable
                  style={styles.modalOptionRow}
                  onPress={() => {
                    closeOptionsMenu();
                    navigation.navigate("setUserName");
                  }}
                >
                  <Text style={styles.modalOptionText}>Alterar nome</Text>
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={theme.colors.text}
                  />
                </Pressable>
                <Pressable
                  style={styles.modalOptionRow}
                  onPress={toggleTheme}
                >
                  <Text style={styles.modalOptionText}>
                    {isDark ? "Tema claro" : "Tema escuro"}
                  </Text>
                  <Ionicons
                    name={isDark ? "sunny-outline" : "moon-outline"}
                    size={18}
                    color={theme.colors.text}
                  />
                </Pressable>
                <Pressable
                  style={styles.modalOptionRow}
                  onPress={() => {
                    closeOptionsMenu();
                    navigation.navigate("insights");
                  }}
                >
                  <Text style={styles.modalOptionText}>Estatísticas de humor</Text>
                  <Ionicons
                    name="analytics-outline"
                    size={18}
                    color={theme.colors.text}
                  />
                </Pressable>
                {canSort && (
                  <>
                    <Pressable
                      style={styles.modalOptionRow}
                      onPress={() => setIsSortSubmenuOpen((open) => !open)}
                    >
                      <Text style={styles.modalOptionText}>Ordenar por</Text>
                      <Ionicons
                        name={isSortSubmenuOpen ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={theme.colors.text}
                      />
                    </Pressable>
                    {isSortSubmenuOpen &&
                      SORT_OPTIONS.map((option) => {
                        const isActive =
                          sortField === option.field && sortDirection === option.direction;

                        return (
                          <Pressable
                            key={`${option.field}-${option.direction}`}
                            style={styles.modalOptionNested}
                            onPress={() => {
                              setSortField(option.field);
                              setSortDirection(option.direction);
                              closeOptionsMenu();
                            }}
                          >
                            <Text
                              style={[
                                styles.modalOptionText,
                                isActive && styles.modalOptionTextActive
                              ]}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                  </>
                )}

                {hasAnyHumors && (
                  <Pressable
                    style={styles.modalOptionRow}
                    onPress={handleStartBulkDelete}
                  >
                    <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>
                      Excluir vários
                    </Text>
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={theme.colors.error}
                    />
                  </Pressable>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.backgroundOverlay,
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingTop: 56,
      paddingRight: 8
    },
    modalSheet: {
      backgroundColor: theme.colors.paper,
      borderRadius: 8,
      minWidth: 220,
      overflow: "hidden"
    },
    modalTitle: {
      padding: 16,
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.background
    },
    modalOptionRow: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    },
    modalOptionNested: {
      paddingVertical: 12,
      paddingLeft: 28,
      paddingRight: 16
    },
    modalOptionText: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text
    },
    modalOptionTextActive: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.family.bold
    },
    modalOptionTextDanger: {
      color: theme.colors.error
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
