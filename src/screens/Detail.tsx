import { useRoute } from "@react-navigation/native";
import { Text } from "react-native";

import { TRouteProps } from "./../Routes";

export const DetailPage = () => {
  const { params } = useRoute<TRouteProps<"detail">>();

  return (
    <>
      <Text>Details: {params.rate}</Text>
    </>
  );
};