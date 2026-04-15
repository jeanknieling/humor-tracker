import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused ,useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "./../../themes/Theme";
import { TNavigationScreenProps, TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { Footer } from "./../shared/components/Footer";
import { Header } from "./../shared/components/Header";
import { StarRating } from "./../shared/components/StarRating";


export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();
  const { params } = useRoute<TRouteProps<"home">>();
  const [userName, setUserName] = useState<string | undefined>(params?.newName);
  const [userHumorList, setUserHumorList] = useState<string[]>([]);
  const [selectedRate, setSelectedRate] = useState<number>(0);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if(params?.newName.trim()) setUserName(params?.newName);
  }, [params?.newName]);

  useEffect(() => {
    AsyncStorage.getItem("user-name").then((value) => {
      setUserName(value ?? '');
    });

    AsyncStorage.getItem("humor-list").then((value) => {
      setUserHumorList(value ? JSON.parse(value) : []);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedRate(0);
    }, [])
  );

  return (
    <>
      <Header userName={userName} />

      <View style={styles.container}>
        {userHumorList.length  ? (
          userHumorList.map((humor) => (
            <Text key={humor}>{humor}</Text>
          ))
        ) : (
          <Text style={styles.emptyListText}>
            Você ainda não {'\n'}
            registrou nenhum humor!
          </Text>
        )}
      </View>

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
                  setTimeout(() => {
                    navigation.navigate("detail", { rate });
                  }, 50);
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
  container: {
    flex: 1,
    flexDirection: 'column',
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