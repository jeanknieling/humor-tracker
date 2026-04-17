import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { theme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";
import { HumorCard } from "./../shared/components/HumorCard";
import { StarRating } from "./../shared/components/StarRating";

export interface IUserHumor {
  id: string;
  dateTime: number;
  rate: number;
  description: string;
}

export type SortField = "dateTime" | "rate" | "description";
export type SortDir = "asc" | "desc";

function sortHumorList(
  list: IUserHumor[],
  field: SortField,
  dir: SortDir
): IUserHumor[] {
  const listCopy = [...list];

  listCopy.sort((a, b) => {
    if (field === "dateTime") {
      return dir === "desc"
        ? b.dateTime - a.dateTime
        : a.dateTime - b.dateTime;
    }

    if (field === "rate") {
      return dir === "desc" ? b.rate - a.rate : a.rate - b.rate;
    }

    const descriptionCompare = a.description.localeCompare(b.description, "pt-BR", {
      sensitivity: "base",
    });
    return dir === "desc" ? -descriptionCompare : descriptionCompare;
  });

  return listCopy;
}

export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"home">>();
  const [userName, setUserName] = useState<string | undefined>(params?.newName);
  const [userHumorList, setUserHumorList] = useState<IUserHumor[]>([]);
  const [selectedRate, setSelectedRate] = useState<number>(0);
  const [sortField, setSortField] = useState<SortField>("dateTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const isFocused = useIsFocused();

  const sortedList = useMemo(
    () => sortHumorList(userHumorList, sortField, sortDir),
    [userHumorList, sortField, sortDir]
  );

  useEffect(() => {
    if (params?.newName?.trim()) setUserName(params?.newName ?? "");
  }, [params?.newName]);

  useEffect(() => {
    AsyncStorage.getItem("user-name").then((value) => {
      setUserName(value ?? "");
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedRate(0);
      AsyncStorage.getItem("humor-list").then((value) => {
        setUserHumorList(value ? JSON.parse(value) : []);
      });
    }, [])
  );

  const sortOptions: { field: SortField; dir: SortDir; label: string }[] = [
    { field: "dateTime", dir: "desc", label: "Data (mais recente)" },
    { field: "dateTime", dir: "asc", label: "Data (mais antiga)" },
    { field: "rate", dir: "desc", label: "Nota (maior primeiro)" },
    { field: "rate", dir: "asc", label: "Nota (menor primeiro)" },
    { field: "description", dir: "asc", label: "Descrição (A–Z)" },
    { field: "description", dir: "desc", label: "Descrição (Z–A)" },
  ];

  return (
    <>
      <Header
        userName={userName}
        actions={
          userHumorList.length > 1 && (
            <Pressable
              onPress={() => setSortMenuOpen(true)}
              hitSlop={12}
            >
              <Ionicons 
                name="ellipsis-vertical" 
                size={24} 
                color={theme.colors.text} 
              />
            </Pressable>
          )
        }
      />

      <Modal
        visible={sortMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSortMenuOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Ordenar por</Text>
                {sortOptions.map((opt) => (
                  <Pressable
                    key={`${opt.field}-${opt.dir}`}
                    style={styles.modalOption}
                    onPress={() => {
                      setSortField(opt.field);
                      setSortDir(opt.dir);
                      setSortMenuOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        sortField === opt.field &&
                          sortDir === opt.dir &&
                          styles.modalOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={sortedList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HumorCard
            dateTime={item.dateTime}
            rate={item.rate}
            description={item.description}
            onPress={() => navigation.navigate("detail", { id: item.id })}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              Você ainda não {"\n"}
              registrou nenhum humor!
            </Text>
          </View>
        )}
      />

      <Footer isFocused={isFocused}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>
            {!userName ? "Qual é o seu nome?" : "Como está seu humor hoje?"}
          </Text>
          {!userName ? (
            <BaseInput label="Nome" asButton onPress={() => navigation.navigate("setUserName")}>
              <TextInput
                style={styles.footerInput}
                placeholder="Escreva seu nome aqui..."
                placeholderTextColor={theme.colors.textPlaceholder}
                editable={false}
              />
            </BaseInput>
          ) : (
            <StarRating
              rate={selectedRate}
              onChange={(rate) => {
                setSelectedRate(rate);
                navigation.navigate("detail", { rate });
              }}
            />
          )}
        </View>
      </Footer>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    gap: 8,
    flexGrow: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    color: theme.colors.textPlaceholder,
    fontFamily: theme.fonts.family.italic,
    fontSize: theme.fonts.sizes.subtitle,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backgroundOverlay,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 56,
    paddingRight: 8,
  },
  modalSheet: {
    backgroundColor: theme.colors.paper,
    borderRadius: 8,
    minWidth: 220,
    ...theme.shadows.default,
    overflow: "hidden",
  },
  modalTitle: {
    padding: 16,
    fontFamily: theme.fonts.family.bold,
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalOptionText: {
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.text,
  },
  modalOptionTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.family.bold,
  },
  footerContainer: {
    gap: 16,
  },
  footerTitle: {
    textAlign: "center",
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
  },
  footerInput: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
    padding: 12,
  },
});