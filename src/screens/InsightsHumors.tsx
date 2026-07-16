import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { HumorCard } from "./../shared/components/HumorCard";
import { useTheme } from "./../shared/providers/ThemeContext";
import { loadHumorList } from "./../shared/storage/appStorage";
import { IUserHumor } from "./../shared/types/humor";
import { buildPeriodRange } from "./../shared/utils/date";
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
  return params.source.type === "best" ? pickBests(inRange) : pickWorsts(inRange);
}

export const InsightsHumorsPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"insightsHumors">>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [humors, setHumors] = useState<IUserHumor[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHumorList().then(setHumors);
    }, [])
  );

  const visibleHumors = useMemo(() => resolveHumors(humors, params), [humors, params]);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
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
          {params.title}
        </Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <FlatList
        data={visibleHumors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <HumorCard
            dateTime={item.dateTime}
            rate={item.rate}
            description={item.description}
            onPress={() => navigation.navigate("detail", { id: item.id })}
          />
        )}
      />
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
    backButtonPlaceholder: {
      width: 40,
      height: 40
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.subtitle,
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
    }
  });
