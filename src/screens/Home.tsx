import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";
import { HumorCard } from "./../shared/components/HumorCard";
import { StarRating } from "./../shared/components/StarRating";
import { useTheme } from "./../shared/theme/ThemeContext";

export interface IUserHumor {
  id: string;
  dateTime: number;
  rate: number;
  description: string;
}

export type SortField = "dateTime" | "rate" | "description";
export type SortDir = "asc" | "desc";

function sortHumorList(list: IUserHumor[], field: SortField, dir: SortDir): IUserHumor[] {
  const listCopy = [...list];

  listCopy.sort((a, b) => {
    if (field === "dateTime") {
      return dir === "desc" ? b.dateTime - a.dateTime : a.dateTime - b.dateTime;
    }

    if (field === "rate") {
      return dir === "desc" ? b.rate - a.rate : a.rate - b.rate;
    }

    const descriptionCompare = a.description.localeCompare(b.description, "pt-BR", {
      sensitivity: "base"
    });
    return dir === "desc" ? -descriptionCompare : descriptionCompare;
  });

  return listCopy;
}

export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"home">>();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [userName, setUserName] = useState<string | undefined>(params?.newName);
  const [userHumorList, setUserHumorList] = useState<IUserHumor[]>([]);
  const [selectedRate, setSelectedRate] = useState<number>(0);
  const [sortField, setSortField] = useState<SortField>("dateTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortExpanded, setSortExpanded] = useState(false);
  const isFocused = useIsFocused();
  const canSort = userHumorList.length > 1;
  const hasHumorCards = userHumorList.length > 0;

  const closeMenu = () => {
    setMenuOpen(false);
    setSortExpanded(false);
  };

  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.setItem("humor-list", JSON.stringify([]));
      setUserHumorList([]);
    } catch {
      Alert.alert("Erro ao excluir os registros de humor");
    }
  };

  const handleConfirmDeleteAll = () => {
    closeMenu();
    Alert.alert(
      "Excluir todos",
      "Tem certeza que deseja excluir todos os registros de humor?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: handleDeleteAll
        }
      ]
    );
  };

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
    { field: "description", dir: "desc", label: "Descrição (Z–A)" }
  ];

  return (
    <>
      <Header
        userName={userName}
        actions={
          !!userName && (
            <Pressable
              onPress={() => setMenuOpen(true)}
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
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Opções</Text>
                <Pressable
                  style={styles.modalOptionRow}
                  onPress={() => {
                    closeMenu();
                    navigation.navigate("setUserName");
                  }}
                >
                  <Text style={styles.modalOptionText}>Alterar nome</Text>
                  <Ionicons
                    name={"pencil-outline"}
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
                {canSort && (
                  <>
                    <Pressable
                      style={styles.modalOptionRow}
                      onPress={() => setSortExpanded((open) => !open)}
                    >
                      <Text style={styles.modalOptionText}>Ordenar por</Text>
                      <Ionicons
                        name={sortExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={theme.colors.text}
                      />
                    </Pressable>
                    {sortExpanded &&
                      sortOptions.map((opt) => (
                        <Pressable
                          key={`${opt.field}-${opt.dir}`}
                          style={styles.modalOptionNested}
                          onPress={() => {
                            setSortField(opt.field);
                            setSortDir(opt.dir);
                            closeMenu();
                          }}
                        >
                          <Text
                            style={[
                              styles.modalOptionText,
                              sortField === opt.field &&
                                sortDir === opt.dir &&
                                styles.modalOptionTextActive
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </Pressable>
                      ))}
                  </>
                )}

                {hasHumorCards && (
                  <Pressable
                    style={styles.modalOptionRow}
                    onPress={handleConfirmDeleteAll}
                  >
                    <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>
                      Excluir todos
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
      ...theme.shadows.default,
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
