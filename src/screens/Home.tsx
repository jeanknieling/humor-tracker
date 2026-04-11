import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";

import { TNavigationScreenProps } from "./../Routes";
import { Header } from "./../shared/components/Header";
import { Footer } from "./../shared/components/Footer";


export const HomePage = () => {
  const navigation = useNavigation<TNavigationScreenProps>();

  return (
    <>
      <Header userName="John Doe" />
      <View style={{flex: 1}}>Home</View>
      <Footer>
        <Text style={{fontFamily: 'extraBold'}}>Home</Text>
      </Footer>
    </>
  );
}