import { loginClient, loginValidation } from "@/api/auth";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { LockIcon, MailIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useToast from "@/hooks/useToast";
import useUserStore from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { z } from "zod";

export default function Login() {
  const toast = useToast();
  const tokenize = useUserStore((state) => state.tokenize);

  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
  });

  const login = useMutation({
    mutationFn: loginClient,
    onSuccess: async ({ token }) => {
      toast.show({ title: "Berhasil masuk", action: "success" });
      await AsyncStorage.setItem("token", token);
      tokenize(token);
    },
    onError: (e) => {
      if (
        (e as AxiosError).status === 401 ||
        (e as AxiosError).status === 422 ||
        (e as AxiosError).status === 404
      ) {
        toast.show(
          {
            title: "Username atau password salah",
            action: "error",
          },
          {
            duration: 2000,
            placement: "top",
          }
        );
      }
    },
  });

  const onLogin = form.handleSubmit((data) => {
    login.mutateAsync(data);
    Keyboard.dismiss();
  });

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Box className="flex-1 p-12 justify-center">
          <Box className="items-center mb-8">
            <Image
              source={require("@/assets/images/pln.png")}
              className="w-[80%]"
              resizeMode="contain"
              alt="Logo PLN"
            />
          </Box>
          <Box className="mb-20">
            <Text className="text-2xl font-bold text-primary-700 text-center">
              SmartRespon PLN
            </Text>
            <Text className="text-xl text-center">ULP Sukarami</Text>
          </Box>
          <Controller
            control={form.control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <FormControl
                className="mb-5"
                isInvalid={Boolean(form.formState.errors.email?.message)}
              >
                <Input size="xl">
                  <InputSlot className="pl-3">
                    <InputIcon className="text-black" as={MailIcon} />
                  </InputSlot>
                  <InputField
                    keyboardType="email-address"
                    value={value}
                    readOnly={login.isPending}
                    onChangeText={onChange}
                    placeholder="Email"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.email?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <FormControl
                className="mb-5"
                isInvalid={Boolean(form.formState.errors.password?.message)}
              >
                <Input size="xl">
                  <InputSlot className="pl-3">
                    <InputIcon className="text-black" as={LockIcon} />
                  </InputSlot>
                  <InputField
                    value={value}
                    readOnly={login.isPending}
                    onChangeText={onChange}
                    type="password"
                    placeholder="Password"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.password?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
          <Button
            size="xl"
            onPress={() => onLogin()}
            disabled={login.isPending}
          >
            {login.isPending && <ButtonSpinner color={"white"} />}
            <ButtonText>Masuk</ButtonText>
          </Button>
        </Box>
      </KeyboardAvoidingView>

      <Box className="p-12">
        <Text className="text-center">
          Belum punya akun?{" "}
          <Link href={"/register"}>
            <Text className="text-blue-500 font-bold">Daftar</Text>
          </Link>
        </Text>
      </Box>
    </>
  );
}
