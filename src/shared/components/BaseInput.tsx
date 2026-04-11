import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../../../themes/Theme";

type IBaseInputProps = {
  children: React.ReactNode;
  label: string;
  asButton?: boolean;
  onPress?: () => void;
}

export const BaseInput = ({ children, label, asButton, onPress }: IBaseInputProps) => {
  return (
    <View style={styles.baseInputContainer}>
      <Text style={styles.label}>{label}</Text>
      
      {asButton ? (
        <Pressable 
          style={({ pressed }) => pressed ? [styles.baseInput, styles.baseInputPressed] : styles.baseInput}
          onPress={onPress}
        >
          {children}
        </Pressable>
      ) : (
        <View 
          style={styles.baseInput}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  baseInputContainer: {
    gap: 4,
  },
  label: {
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.sizes.body,
  },
  baseInput: {
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  baseInputPressed: {
    opacity: 0.5,
  },
});