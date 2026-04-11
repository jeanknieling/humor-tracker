import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SafeAreaView } from 'react-native-safe-area-context';
import { DetailPage } from './screens/Detail';
import { HomePage } from './screens/Home';
import { SetUserNamePage } from './screens/SetUserName';
import { theme } from './../themes/Theme';

type TScreenDefinitions = {
  home: undefined;
  setUserName: undefined;
  detail: {rate: number};
};

const Stack = createNativeStackNavigator<TScreenDefinitions>();

export const AppRouters = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      screenLayout={({children}) => (
        <SafeAreaView 
          style={{flex: 1}}
          edges={['top', 'left', 'right']}
        >
          {children}
        </SafeAreaView>
      )}
      >
        <Stack.Screen name="home" component={HomePage} />

        <Stack.Group
        screenOptions={{
          presentation: 'formSheet',
          sheetCornerRadius: 24,
        }}>
          <Stack.Screen 
          name="detail" 
          component={DetailPage} 
          options={{
            sheetAllowedDetents: [0.8, 0.92],
          }}
          />
          <Stack.Screen name="setUserName" component={SetUserNamePage} 
          options={{
            sheetAllowedDetents: [0.4, 0.6],
          }}
        />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type TNavigationScreenProps = NativeStackNavigationProp<TScreenDefinitions>;
export type TRouteProps<T extends keyof TScreenDefinitions> = RouteProp<TScreenDefinitions, T>;