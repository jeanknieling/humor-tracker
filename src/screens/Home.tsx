import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native";

import { TNavigationScreenProps } from "./../Routes";
import { Header } from "./../shared/components/Header";


export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <>
      <Header userName="John Doe" />
      <Text>Home</Text>
      <Button title="Go to Detail" onPress={() => navigation.navigate('detail', { rate: 10 })} />
      <Button title="Go to Set User Name" onPress={() => navigation.navigate('setUserName')} />
    </>
  );
}