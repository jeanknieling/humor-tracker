import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";
import { HumorCard } from "./../shared/components/HumorCard";
import { StarRating } from "./../shared/components/StarRating";

interface IUserHumor {
  id: string;
  dateTime: string;
  rate: number;
  description: string;
}

export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"home">>();
  const [userName, setUserName] = useState<string | undefined>(params?.newName);
  const [userHumorList, setUserHumorList] = useState<IUserHumor[]>([
    {id: "1", dateTime: "2026-04-15 10:00:00", rate: 1, description: "Teste 1"},
    {id: "2", dateTime: "2026-04-15 10:00:00", rate: 3, description: "Teste 2"},
    {id: "3", dateTime: "2026-04-15 10:00:00", rate: 5, description: "Teste 3"},
    {id: "4", dateTime: "2026-04-15 10:00:00", rate: 2, description: "Teste 4"},
    {id: "5", dateTime: "2026-04-15 10:00:00", rate: 4, description: "Teste 5"},
    {id: "6", dateTime: "2026-04-15 10:00:00", rate: 1, description: "Teste 6"},
    {id: "7", dateTime: "2026-04-15 10:00:00", rate: 3, description: "Teste 7"},
    {id: "8", dateTime: "2026-04-15 10:00:00", rate: 5, description: "Teste 8"},
  ]);
  const [selectedRate, setSelectedRate] = useState<number>(0);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if(params?.newName.trim()) setUserName(params?.newName);
  }, [params?.newName]);

  useEffect(() => {
    AsyncStorage.getItem("user-name").then((value) => {
      setUserName(value ?? '');
    });

    /* AsyncStorage.getItem("humor-list").then((value) => {
      setUserHumorList(value ? JSON.parse(value) : []);
    }); */
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedRate(0);
    }, [])
  );

  return (
    <>
      <Header userName={userName} />

      <FlatList 
        contentContainerStyle={styles.listContainer}
        data={userHumorList} 
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <HumorCard 
            dateTime={item.dateTime} 
            rate={item.rate} 
            description={item.description} 
          />
        )} 
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              Você ainda não {'\n'}
              registrou nenhum humor!
            </Text>
          </View>
        )}
      />
        
      <Footer isFocused={isFocused}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>
            {!userName ? 'Qual é o seu nome?' : 'Como está seu humor hoje?'}
          </Text>
          {
            !userName ? (
              <BaseInput 
                label="Nome" 
                asButton
                onPress={() => navigation.navigate('setUserName')}
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
            )
          }
        </View>
      </Footer>
    </>
  );
}

  const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    gap: 8,
    flexGrow: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    color: theme.colors.textPlaceholder,
    fontFamily: theme.fonts.family.italic,
    fontSize: theme.fonts.sizes.subtitle,
    textAlign: 'center',
  },
  footerContainer: {
    gap: 16,
  },
  footerTitle: {
    textAlign: 'center',
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
  footerStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});