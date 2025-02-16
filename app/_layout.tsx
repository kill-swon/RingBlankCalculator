import { Stack } from 'expo-router';
import { Appearance, useColorScheme } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export default function RootLayout() {
  let theme = {};
  let colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    theme = {
      ...MD3DarkTheme,
      colors: {
        ...MD3DarkTheme.colors,
        primary: '#CAE0BC',
        secondary: '#6E8E59',
      },
    };
  } else {
    theme = {
      ...MD3LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        primary: '#6E8E59',
        secondary: '#CAE0BC',
      },
    };
  }


  
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
