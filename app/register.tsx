import { registerClient, registerValidation } from "@/api/auth";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { AtSignIcon, LockIcon, MailIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useToast from "@/hooks/useToast";
import useUserStore from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { z } from "zod";

export default function Login() {
  const toast = useToast();
  const tokenize = useUserStore((state) => state.tokenize);

  const form = useForm<z.infer<typeof registerValidation>>({
    resolver: zodResolver(registerValidation),
  });

  const register = useMutation({
    mutationFn: registerClient,
    onSuccess: async ({ token }) => {
      toast.show({
        title: "Pendaftaran berhasil",
        action: "success",
      });
      await AsyncStorage.setItem("token", token);
      tokenize(token);
    },
  });

  const onRegister = form.handleSubmit((data) => {
    register.mutateAsync(data);
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
                    readOnly={register.isPending}
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
            name="fullname"
            render={({ field: { value, onChange } }) => (
              <FormControl
                className="mb-5"
                isInvalid={Boolean(form.formState.errors.fullname?.message)}
              >
                <Input size="xl">
                  <InputSlot className="pl-3">
                    <InputIcon className="text-black" as={AtSignIcon} />
                  </InputSlot>
                  <InputField
                    value={value}
                    readOnly={register.isPending}
                    onChangeText={onChange}
                    placeholder="Nama Lengkap"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.fullname?.message}
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
                    readOnly={register.isPending}
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
          <Controller
            control={form.control}
            name="repeatPassword"
            render={({ field: { value, onChange } }) => (
              <FormControl
                className="mb-5"
                isInvalid={Boolean(
                  form.formState.errors.repeatPassword?.message
                )}
              >
                <Input size="xl">
                  <InputSlot className="pl-3">
                    <InputIcon className="text-black" as={LockIcon} />
                  </InputSlot>
                  <InputField
                    value={value}
                    readOnly={register.isPending}
                    onChangeText={onChange}
                    type="password"
                    placeholder="Ulangi Password"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {form.formState.errors.repeatPassword?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
          <Button
            size="xl"
            onPress={() => onRegister()}
            disabled={register.isPending}
          >
            {register.isPending && <ButtonSpinner color={"white"} />}
            <ButtonText>Daftar</ButtonText>
          </Button>
        </Box>
      </KeyboardAvoidingView>
      <Box className="p-12">
        <Text className="text-center">
          Sudah punya akun?{" "}
          <Link href={"/login"}>
            <Text className="text-blue-500 font-bold">Masuk</Text>
          </Link>
        </Text>
      </Box>
    </>
  );
}
