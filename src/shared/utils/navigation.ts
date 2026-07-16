import { TNavigationScreenProps } from "../../Routes";

/** Pilha limpa: Home → Estatísticas. Voltar em Insights sempre cai na Home. */
export function resetToInsights(navigation: TNavigationScreenProps) {
  navigation.reset({
    index: 1,
    routes: [{ name: "home" }, { name: "insights" }]
  });
}

export function resetToHome(navigation: TNavigationScreenProps) {
  navigation.reset({
    index: 0,
    routes: [{ name: "home" }]
  });
}

/** Garante [home, insights] sem remount se a pilha já estiver limpa. */
export function ensureInsightsStack(navigation: TNavigationScreenProps) {
  const state = navigation.getState();
  if (!state) return;

  const isClean =
    state.index === 1 &&
    state.routes.length === 2 &&
    state.routes[0]?.name === "home" &&
    state.routes[1]?.name === "insights";

  if (!isClean) {
    resetToInsights(navigation);
  }
}
