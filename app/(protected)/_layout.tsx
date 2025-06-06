import { checkTokenClient, logoutClient } from "@/api/auth";
import client from "@/api/client";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import useUserStore from "@/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const token = useUserStore((state) => state.token);
  const tokenize = useUserStore((state) => state.tokenize);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    tokenize(null);
  };

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => (token ? checkTokenClient(token) : null),
  });

  const logout = useMutation({
    mutationFn: logoutClient,
    onSuccess: onLogout,
  });

  useEffect(() => {
    setUser(user.data || null);
  }, [user.data]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user"] });

    client.defaults.headers.common.Authorization = token
      ? `Bearer ${token}`
      : undefined;
  }, [token]);

  useEffect(() => {
    if (user.error && (user.error as AxiosError).response?.status === 401) {
      onLogout();
    }
  }, [user.error]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Daftar Pengaduan",
          headerRight: () => (
            <Button
              variant="link"
              onPress={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? (
                <ButtonSpinner color="#AAA"></ButtonSpinner>
              ) : (
                <ButtonText className="text-blue-600">Keluar</ButtonText>
              )}
            </Button>
          ),
        }}
      />
      <Stack.Screen name="compose" />
      <Stack.Screen name="detail" options={{ title: "" }} />
    </Stack>
  );
}
