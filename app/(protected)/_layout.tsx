import { checkTokenClient } from "@/api/auth";
import client from "@/api/client";
import useUserStore from "@/store/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const token = useUserStore((state) => state.token);
  const tokenize = useUserStore((state) => state.tokenize);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => (token ? checkTokenClient(token) : null),
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
      tokenize(null);
    }
  }, [user.error]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Daftar Pengaduan" }} />
      <Stack.Screen name="compose" />
    </Stack>
  );
}
