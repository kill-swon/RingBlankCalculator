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
        primary: '#03DAC6',
        secondary: '#3700B3',
      },
    };
  } else {
    theme = {
      ...MD3LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        primary: '#3700B3',
        secondary: '#03DAC6',
      },
    };
  }
  
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
