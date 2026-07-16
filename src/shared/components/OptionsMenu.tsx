import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

import { AppTheme } from "../../../themes/Theme";
import { TNavigationScreenProps } from "../../Routes";
import { useTheme } from "../providers/ThemeContext";
import { HumorSortDirection, HumorSortField } from "../types/humor";
import { SORT_OPTIONS } from "../utils/humorSort";

type OptionsMenuListActions = {
  canSort: boolean;
  sortField: HumorSortField;
  sortDirection: HumorSortDirection;
  onSortChange: (field: HumorSortField, direction: HumorSortDirection) => void;
  canBulkDelete: boolean;
  onBulkDelete: () => void;
};

type OptionsMenuProps = {
  visible: boolean;
  onClose: () => void;
  showInsightsOption?: boolean;
  listActions?: OptionsMenuListActions;
};

export function OptionsMenu({
  visible,
  onClose,
  showInsightsOption = true,
  listActions
}: OptionsMenuProps) {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isSortSubmenuOpen, setIsSortSubmenuOpen] = useState(false);

  const closeMenu = () => {
    setIsSortSubmenuOpen(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
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

              {showInsightsOption && (
                <Pressable
                  style={styles.modalOptionRow}
                  onPress={() => {
                    closeMenu();
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
              )}

              {listActions?.canSort && (
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
                        listActions.sortField === option.field &&
                        listActions.sortDirection === option.direction;

                      return (
                        <Pressable
                          key={`${option.field}-${option.direction}`}
                          style={styles.modalOptionNested}
                          onPress={() => {
                            listActions.onSortChange(option.field, option.direction);
                            closeMenu();
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

              {listActions?.canBulkDelete && (
                <Pressable
                  style={styles.modalOptionRow}
                  onPress={() => {
                    closeMenu();
                    listActions.onBulkDelete();
                  }}
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
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
    }
  });
