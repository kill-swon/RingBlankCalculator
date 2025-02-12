import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";

export default function RootLayout() {

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };
  
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
