import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import useUserStore from "@/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const token = useUserStore((state) => state.token);
  const tokenize = useUserStore((state) => state.tokenize);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem("token").then(tokenize);

      SplashScreen.hideAsync();
    })();
  }, [mount]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMount(true);
    }, 1000);

    return () => {
      setMount(false);
      clearTimeout(timeout);
    };
  }, [token]);

  if (!mount) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Protected guard={Boolean(token)}>
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
            </Stack.Protected>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
