import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailPage } from './screens/Detail';
import { HomePage } from './screens/Home';
import { SetUserNamePage } from './screens/SetUserName';
import { useTheme } from './shared/theme/ThemeContext';

type TScreenDefinitions = {
  home: { newName?: string } | undefined;
  setUserName: undefined;
  detail: { rate?: number, id?: string };
};

const Stack = createNativeStackNavigator<TScreenDefinitions>();

export const AppRouters = () => {
  const { theme } = useTheme();

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
          style={{flex: 1, backgroundColor: theme.colors.background}}
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
            contentStyle: {
              backgroundColor: theme.colors.background,
              height: '100%',
            },
          }}
          screenLayout={({children}) => (
            <SafeAreaView 
              style={{
                flex: 1,
                padding: 16,
                backgroundColor: theme.colors.paper,
              }}
              edges={['left', 'right']}
            >
              {children}
            </SafeAreaView>
          )}
        >
          <Stack.Screen 
          name="detail" 
          component={DetailPage} 
          options={{
            sheetAllowedDetents: [0.8],
          }}
          />
          <Stack.Screen name="setUserName" component={SetUserNamePage} 
          options={{
            sheetAllowedDetents: [0.6],
          }}
        />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type TNavigationScreenProps = NativeStackNavigationProp<TScreenDefinitions>;
export type TRouteProps<T extends keyof TScreenDefinitions> = RouteProp<TScreenDefinitions, T>;
