import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { Button } from "./../shared/components/Button";
import { HumorCard } from "./../shared/components/HumorCard";
import { OptionsMenu } from "./../shared/components/OptionsMenu";
import { useHumorSelection } from "./../shared/hooks/useHumorSelection";
import { useTheme } from "./../shared/providers/ThemeContext";
import { loadHumorList, saveHumorList } from "./../shared/storage/appStorage";
import { HumorSortDirection, HumorSortField, IUserHumor } from "./../shared/types/humor";
import { buildPeriodRange } from "./../shared/utils/date";
import { sortHumorList } from "./../shared/utils/humorSort";
import {
  filterHumorsByMonth,
  filterHumorsInRange,
  pickBests,
  pickWorsts
} from "./../shared/utils/humorStats";

function resolveHumors(
  list: IUserHumor[],
  params: TRouteProps<"insightsHumors">["params"]
): IUserHumor[] {
  if (params.source.type === "month") {
    return filterHumorsByMonth(list, params.source.year, params.source.month);
  }

  const inRange = filterHumorsInRange(list, buildPeriodRange(params.source.period));

  if (params.source.type === "period") {
    return inRange;
  }

  return params.source.type === "best" ? pickBests(inRange) : pickWorsts(inRange);
}

export const InsightsHumorsPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"insightsHumors">>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [allHumors, setAllHumors] = useState<IUserHumor[]>([]);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [sortField, setSortField] = useState<HumorSortField>("dateTime");
  const [sortDirection, setSortDirection] = useState<HumorSortDirection>("desc");
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHumorList().then(setAllHumors);
    }, [])
  );

  const filteredHumors = useMemo(() => resolveHumors(allHumors, params), [allHumors, params]);
  const visibleIds = useMemo(
    () => filteredHumors.map((humor) => humor.id),
    [filteredHumors]
  );
  const {
    selectedHumorIds,
    clearSelection,
    toggleHumorSelection,
    toggleSelectAllVisible,
    areAllVisibleSelected,
    confirmDeleteSelected
  } = useHumorSelection(visibleIds);

  const sortedHumors = useMemo(
    () => sortHumorList(filteredHumors, sortField, sortDirection),
    [filteredHumors, sortField, sortDirection]
  );

  const canSort = filteredHumors.length > 1;
  const canBulkDelete = filteredHumors.length > 1 && !isSelectionMode;

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    clearSelection();
  };

  const enterSelectionMode = () => {
    setIsOptionsMenuOpen(false);
    setIsSelectionMode(true);
    clearSelection();
  };

  const handleDeleteSelectedHumors = () => {
    confirmDeleteSelected(async (ids) => {
      const idsToDelete = new Set(ids);
      const remainingHumors = allHumors.filter((humor) => !idsToDelete.has(humor.id));
      await saveHumorList(remainingHumors);
      setAllHumors(remainingHumors);
      exitSelectionMode();
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => (isSelectionMode ? exitSelectionMode() : navigation.goBack())}
          style={styles.backButton}
          accessibilityLabel={isSelectionMode ? "Cancelar seleção" : "Voltar"}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {isSelectionMode ? "Selecionar" : params.title}
        </Text>
        <Pressable
          onPress={() => setIsOptionsMenuOpen(true)}
          style={styles.backButton}
          hitSlop={12}
          accessibilityLabel="Opções"
        >
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
      </View>

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
          canBulkDelete,
          onBulkDelete: enterSelectionMode
        }}
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

      <FlatList
        data={sortedHumors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          </View>
        }
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
      />

      {isSelectionMode && (
        <View style={[styles.selectionFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button
            title="Cancelar"
            variant="outlined"
            flex
            onPress={exitSelectionMode}
          />
          <Button
            title={selectedHumorIds.length > 0 ? `Excluir (${selectedHumorIds.length})` : "Excluir"}
            flex
            variant="outlined"
            color={theme.colors.error}
            onPress={selectedHumorIds.length > 0 ? handleDeleteSelectedHumors : undefined}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingVertical: 8
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.subtitle,
      color: theme.colors.text
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
    listContent: {
      padding: 16,
      gap: 8,
      paddingBottom: 32,
      flexGrow: 1
    },
    empty: {
      paddingVertical: 32,
      alignItems: "center"
    },
    emptyText: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.textPlaceholder,
      textAlign: "center"
    },
    selectionFooter: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: theme.colors.paper,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16
    }
  });
