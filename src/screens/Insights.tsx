import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppTheme } from "./../../themes/Theme";
import { TNavigationScreenProps } from "./../Routes";
import { OptionsMenu } from "./../shared/components/OptionsMenu";
import { StarRating } from "./../shared/components/StarRating";
import { useTheme } from "./../shared/providers/ThemeContext";
import { loadHumorList } from "./../shared/storage/appStorage";
import { IUserHumor } from "./../shared/types/humor";
import {
  createDefaultPeriodSelection,
  formatMonthYearLabel,
  formatPeriodLabel,
  MONTH_SHORT_PT,
  PeriodMode,
  PeriodSelection
} from "./../shared/utils/date";
import { computeHumorPeriodStats, MonthBucket } from "./../shared/utils/humorStats";

const PERIOD_MODES: { mode: PeriodMode; label: string }[] = [
  { mode: "month", label: "Mês" },
  { mode: "year", label: "Ano" }
];

type YearGroup = {
  year: number;
  buckets: MonthBucket[];
};

function formatAverage(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(1).replace(".", ",");
}

function groupBucketsByYear(buckets: MonthBucket[]): YearGroup[] {
  const byYear = new Map<number, MonthBucket[]>();

  for (const bucket of buckets) {
    const list = byYear.get(bucket.year) ?? [];
    list.push(bucket);
    byYear.set(bucket.year, list);
  }

  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, yearBuckets]) => ({ year, buckets: yearBuckets }));
}

function Stepper({
  label,
  valueLabel,
  onPrev,
  onNext
}: {
  label: string;
  valueLabel: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={onPrev}
          style={styles.stepperButton}
          accessibilityLabel={`Anterior: ${label}`}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={theme.colors.primary}
          />
        </Pressable>
        <Text style={styles.stepperValue}>{valueLabel}</Text>
        <Pressable
          onPress={onNext}
          style={styles.stepperButton}
          accessibilityLabel={`Próximo: ${label}`}
        >
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

export const InsightsPage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [humors, setHumors] = useState<IUserHumor[]>([]);
  const [selection, setSelection] = useState<PeriodSelection>(() => createDefaultPeriodSelection());
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  useFocusEffect(
    useCallback(() => {
      loadHumorList().then(setHumors);
    }, [])
  );

  const periodLabel = useMemo(() => formatPeriodLabel(selection), [selection]);
  const stats = useMemo(
    () => computeHumorPeriodStats(humors, selection),
    [humors, selection]
  );
  const yearGroups = useMemo(
    () => groupBucketsByYear(stats.monthlyBuckets),
    [stats.monthlyBuckets]
  );

  useEffect(() => {
    if (yearGroups.length === 0) {
      setExpandedYears(new Set());
      return;
    }
    setExpandedYears(new Set([yearGroups[0].year]));
  }, [periodLabel]);

  const toggleYearExpanded = (year: number) => {
    setExpandedYears((current) => {
      const next = new Set(current);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const setMode = (mode: PeriodMode) => {
    setSelection((current) => ({ ...current, mode }));
  };

  const shiftMonth = (field: "month" | "endMonth", delta: number) => {
    setSelection((current) => {
      const isEnd = field === "endMonth";
      let month = isEnd ? current.endMonth : current.month;
      let year = isEnd ? current.endYear : current.year;
      month += delta;
      while (month < 0) {
        month += 12;
        year -= 1;
      }
      while (month > 11) {
        month -= 12;
        year += 1;
      }
      return isEnd ? { ...current, endMonth: month, endYear: year } : { ...current, month, year };
    });
  };

  const shiftYear = (field: "year" | "endYear", delta: number) => {
    setSelection((current) =>
      field === "endYear"
        ? { ...current, endYear: current.endYear + delta }
        : { ...current, year: current.year + delta }
    );
  };

  const starRate = stats.averageRate ?? 0;
  const hasDistinctExtremes =
    stats.bests.length > 0 &&
    stats.worsts.length > 0 &&
    stats.bests[0].rate !== stats.worsts[0].rate;

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
        <Text style={styles.title}>Estatísticas</Text>
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
        showInsightsOption={false}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.panel}>
          <Text style={styles.sectionLabel}>Período</Text>
          <View style={styles.chipsRow}>
            {PERIOD_MODES.map((item) => {
              const active = selection.mode === item.mode;
              return (
                <Pressable
                  key={item.mode}
                  onPress={() => setMode(item.mode)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selection.mode === "month" ? (
            <View style={styles.selectors}>
              <Stepper
                label="De"
                valueLabel={formatMonthYearLabel(selection.month, selection.year)}
                onPrev={() => shiftMonth("month", -1)}
                onNext={() => shiftMonth("month", 1)}
              />
              <Stepper
                label="Até"
                valueLabel={formatMonthYearLabel(selection.endMonth, selection.endYear)}
                onPrev={() => shiftMonth("endMonth", -1)}
                onNext={() => shiftMonth("endMonth", 1)}
              />
            </View>
          ) : (
            <View style={styles.selectors}>
              <Stepper
                label="De"
                valueLabel={String(selection.year)}
                onPrev={() => shiftYear("year", -1)}
                onNext={() => shiftYear("year", 1)}
              />
              <Stepper
                label="Até"
                valueLabel={String(selection.endYear)}
                onPrev={() => shiftYear("endYear", -1)}
                onNext={() => shiftYear("endYear", 1)}
              />
            </View>
          )}
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>{periodLabel}</Text>
          <Text style={styles.heroAverage}>{formatAverage(stats.averageRate)}</Text>
          <Text style={styles.heroCaption}>Média de humor</Text>
          <StarRating
            rate={starRate}
            touchableOpacityDisabled
            size={28}
          />
        </View>

        {stats.count === 0 ? (
          <View style={styles.emptyPanel}>
            <Ionicons
              name="analytics-outline"
              size={36}
              color={theme.colors.textPlaceholder}
            />
            <Text style={styles.emptyTitle}>Sem registros neste período</Text>
            <Text style={styles.emptyText}>
              Escolha outro intervalo ou registre humores na Home para ver a média aqui.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.metricsRow}>
              <Pressable
                style={styles.metricCard}
                disabled={stats.count === 0}
                onPress={() =>
                  navigation.navigate("insightsHumors", {
                    title: "Registros",
                    source: { type: "period", period: selection }
                  })
                }
              >
                <Text style={styles.metricValue}>{stats.count}</Text>
                <Text style={styles.metricLabel}>Registros</Text>
              </Pressable>
              <Pressable
                style={styles.metricCard}
                disabled={!hasDistinctExtremes}
                onPress={() =>
                  navigation.navigate("insightsHumors", {
                    title: stats.bests.length > 1 ? "Melhores Humores" : "Melhor Humor",
                    source: { type: "best", period: selection }
                  })
                }
              >
                <Text style={styles.metricValue}>
                  {hasDistinctExtremes ? `${stats.bests[0].rate}★` : "—"}
                </Text>
                <Text style={styles.metricLabel}>
                  {hasDistinctExtremes && stats.bests.length > 1 ? "Melhores" : "Melhor"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.metricCard}
                disabled={!hasDistinctExtremes}
                onPress={() =>
                  navigation.navigate("insightsHumors", {
                    title: stats.worsts.length > 1 ? "Piores Humores" : "Pior Humor",
                    source: { type: "worst", period: selection }
                  })
                }
              >
                <Text style={styles.metricValue}>
                  {hasDistinctExtremes ? `${stats.worsts[0].rate}★` : "—"}
                </Text>
                <Text style={styles.metricLabel}>
                  {hasDistinctExtremes && stats.worsts.length > 1 ? "Piores" : "Pior"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionLabel}>Média por mês</Text>
              <View style={styles.yearAccordions}>
                {yearGroups.map((group) => {
                  const isExpanded = expandedYears.has(group.year);

                  return (
                    <View
                      key={group.year}
                      style={styles.yearAccordion}
                    >
                      <Pressable
                        style={styles.yearAccordionHeader}
                        onPress={() => toggleYearExpanded(group.year)}
                        accessibilityRole="button"
                        accessibilityState={{ expanded: isExpanded }}
                        accessibilityLabel={`Ano ${group.year}`}
                      >
                        <View style={styles.yearAccordionTitleRow}>
                          <Ionicons
                            name={isExpanded ? "chevron-down" : "chevron-forward"}
                            size={18}
                            color={theme.colors.primary}
                          />
                          <Text style={styles.yearAccordionTitle}>{group.year}</Text>
                        </View>
                      </Pressable>

                      {isExpanded && (
                        <View style={styles.bars}>
                          {group.buckets.map((bucket) => {
                            const ratio =
                              bucket.averageRate == null
                                ? 0
                                : Math.min(bucket.averageRate / 5, 1);
                            const canOpen = bucket.count > 0;

                            return (
                              <Pressable
                                key={bucket.key}
                                style={styles.barRow}
                                disabled={!canOpen}
                                onPress={() =>
                                  navigation.navigate("insightsHumors", {
                                    title: bucket.label,
                                    source: {
                                      type: "month",
                                      year: bucket.year,
                                      month: bucket.month
                                    }
                                  })
                                }
                              >
                                <Text style={styles.barLabel}>
                                  {MONTH_SHORT_PT[bucket.month]}
                                </Text>
                                <View style={styles.barTrack}>
                                  <View
                                    style={[
                                      styles.barFill,
                                      {
                                        width: `${ratio * 100}%`,
                                        backgroundColor:
                                          bucket.averageRate == null
                                            ? theme.colors.textPlaceholder
                                            : theme.colors.primary
                                      }
                                    ]}
                                  />
                                </View>
                                <Text style={styles.barValue}>
                                  {bucket.averageRate == null
                                    ? "—"
                                    : formatAverage(bucket.averageRate)}
                                </Text>
                                {canOpen ? (
                                  <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color={theme.colors.textPlaceholder}
                                  />
                                ) : (
                                  <View style={styles.barChevronPlaceholder} />
                                )}
                              </Pressable>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.subtitle,
      color: theme.colors.text
    },
    content: {
      padding: 16,
      gap: 16,
      paddingBottom: 32
    },
    panel: {
      backgroundColor: theme.colors.paper,
      borderRadius: 16,
      padding: 16,
      gap: 12
    },
    sectionLabel: {
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text
    },
    chipsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.background
    },
    chipActive: {
      backgroundColor: theme.colors.primary
    },
    chipText: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text
    },
    chipTextActive: {
      color: theme.colors.primaryText,
      fontFamily: theme.fonts.family.bold
    },
    selectors: {
      gap: 8
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8
    },
    stepperLabel: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.textPlaceholder,
      minWidth: 36
    },
    stepperControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4
    },
    stepperButton: {
      padding: 4
    },
    stepperValue: {
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text,
      minWidth: 72,
      textAlign: "center"
    },
    hero: {
      backgroundColor: theme.colors.paper,
      borderRadius: 16,
      paddingVertical: 28,
      paddingHorizontal: 16,
      alignItems: "center",
      gap: 8
    },
    heroEyebrow: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.textPlaceholder,
      textTransform: "lowercase"
    },
    heroAverage: {
      fontFamily: theme.fonts.family.bold,
      fontSize: 56,
      lineHeight: 64,
      color: theme.colors.primary
    },
    heroCaption: {
      fontFamily: theme.fonts.family.italic,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.textPlaceholder,
      marginBottom: 4
    },
    metricsRow: {
      flexDirection: "row",
      gap: 8
    },
    metricCard: {
      flex: 1,
      backgroundColor: theme.colors.paper,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      gap: 4
    },
    metricValue: {
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.subtitle,
      color: theme.colors.text
    },
    metricLabel: {
      fontFamily: theme.fonts.family.regular,
      fontSize: 12,
      color: theme.colors.textPlaceholder,
      textAlign: "center"
    },
    bars: {
      gap: 10,
      paddingTop: 4
    },
    yearAccordions: {
      gap: 8
    },
    yearAccordion: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      overflow: "hidden"
    },
    yearAccordionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8
    },
    yearAccordionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6
    },
    yearAccordionTitle: {
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text
    },
    barRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingBottom: 10
    },
    barLabel: {
      width: 32,
      fontFamily: theme.fonts.family.regular,
      fontSize: 12,
      color: theme.colors.text,
      textTransform: "capitalize"
    },
    barTrack: {
      flex: 1,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.paper,
      overflow: "hidden"
    },
    barFill: {
      height: "100%",
      borderRadius: 5,
      minWidth: 0
    },
    barValue: {
      width: 36,
      textAlign: "right",
      fontFamily: theme.fonts.family.bold,
      fontSize: 12,
      color: theme.colors.text
    },
    barChevronPlaceholder: {
      width: 16,
      height: 16
    },
    emptyPanel: {
      backgroundColor: theme.colors.paper,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      gap: 8
    },
    emptyTitle: {
      fontFamily: theme.fonts.family.bold,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.text,
      textAlign: "center"
    },
    emptyText: {
      fontFamily: theme.fonts.family.regular,
      fontSize: theme.fonts.sizes.body,
      color: theme.colors.textPlaceholder,
      textAlign: "center"
    }
  });
