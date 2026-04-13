import { Inter_400Regular, Inter_500Medium_Italic, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import { useEffect } from 'react';

import { AppRouters } from './Routes';


export const App = () => {
  const [loaded, error] = useFonts({
    extraBold: Inter_800ExtraBold,
    regular: Inter_400Regular,
    mediumItalic: Inter_500Medium_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppRouters />
  );
}
