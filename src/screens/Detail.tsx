import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "./../../themes/Theme";
import { TRouteProps } from "./../Routes";
import { BaseInput } from "./../shared/components/BaseInput";
import { StarRating } from "./../shared/components/StarRating";

export const DetailPage = () => {
  const { params } = useRoute<TRouteProps<"detail">>();
  const [selectedRate, setSelectedRate] = useState<number>(params.rate);
  
  return (
    <>
      <View style={styles.footerContainer}>
        <Text style={styles.footerTitle}>
          Como está seu humor hoje?
        </Text>
        
        <StarRating rate={selectedRate} onChange={(rate) => setSelectedRate(rate)} />


        <BaseInput 
          label="Data e hora" 
        >
          <TextInput
            style={styles.footerInput}
            placeholder="Escreva seu nome aqui..."
            placeholderTextColor={theme.colors.textPlaceholder}
            editable={false}
          />
        </BaseInput>

        <BaseInput 
          label="Descreva mais sobre o seu humor" 
        >
          <TextInput
            style={{...styles.footerInput, ...styles.footerInputMultiline}}
            placeholder="Escreva seu nome aqui..."
            placeholderTextColor={theme.colors.textPlaceholder}
            multiline
            numberOfLines={16}
          />
        </BaseInput>
      </View>
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
  footerInputMultiline: {
    height: theme.fonts.sizes.body * 16,
    textAlignVertical: 'top',
  },
  footerStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});