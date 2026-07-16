import { useMemo, useState } from "react";
import { Alert } from "react-native";

/** Seleção de cards para exclusão em massa (Home / InsightsHumors). */
export function useHumorSelection(visibleIds: string[]) {
  const [selectedHumorIds, setSelectedHumorIds] = useState<string[]>([]);

  const areAllVisibleSelected = useMemo(
    () =>
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedHumorIds.includes(id)),
    [visibleIds, selectedHumorIds]
  );

  const clearSelection = () => setSelectedHumorIds([]);

  const toggleHumorSelection = (id: string) => {
    setSelectedHumorIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((itemId) => itemId !== id)
        : [...currentIds, id]
    );
  };

  const toggleSelectAllVisible = () => {
    if (areAllVisibleSelected) {
      setSelectedHumorIds([]);
      return;
    }
    setSelectedHumorIds(visibleIds);
  };

  const confirmDeleteSelected = (onDelete: (ids: string[]) => Promise<void>) => {
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
              await onDelete(selectedHumorIds);
            } catch {
              Alert.alert("Erro ao excluir os registros de humor");
            }
          }
        }
      ]
    );
  };

  return {
    selectedHumorIds,
    clearSelection,
    toggleHumorSelection,
    toggleSelectAllVisible,
    areAllVisibleSelected,
    confirmDeleteSelected
  };
}
