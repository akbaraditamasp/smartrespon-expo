import {
  composeComplaintClient,
  composeComplaintValidation,
  getComplaintClient,
} from "@/api/complaint";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import { z } from "zod";

export default function ComposeComplaint() {
  const param = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const form = useForm<z.infer<typeof composeComplaintValidation>>({
    resolver: zodResolver(composeComplaintValidation),
  });

  const complaint = useQuery({
    queryKey: [`complaint-${param.id}`],
    queryFn: () => (param.id ? getComplaintClient(param.id) : null),
  });

  const compose = useMutation({
    mutationFn: composeComplaintClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      navigation.goBack();
    },
  });

  const onSend = form.handleSubmit((data) => {
    compose.mutateAsync(data);
  });

  useEffect(() => {
    navigation.setOptions({
      title: param.id ? "Edit Pengaduan" : "Buat Pengaduan",
      headerRight: () => (
        <Button
          variant="link"
          onPress={() => onSend()}
          disabled={compose.isPending || complaint.isFetching}
        >
          {compose.isPending ? (
            <ButtonSpinner color="#AAA"></ButtonSpinner>
          ) : (
            <ButtonText className="text-blue-600">Kirim</ButtonText>
          )}
        </Button>
      ),
    });
  }, [compose.isPending, param.id, complaint.isFetching]);

  useEffect(() => {
    if (complaint.data) {
      form.reset({
        address: complaint.data.address,
        description: complaint.data.description,
        title: complaint.data.title,
      });
    }
  }, [complaint.data]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Box className="flex-1 p-5 bg-white">
        <Controller
          control={form.control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <FormControl
              className="mb-5"
              isInvalid={Boolean(form.formState.errors.title?.message)}
            >
              <FormControlLabel>
                <FormControlLabelText>Judul</FormControlLabelText>
              </FormControlLabel>
              <Input size="md">
                <InputSlot />
                <InputField
                  value={value}
                  readOnly={compose.isPending || complaint.isFetching}
                  //   readOnly={login.isPending}
                  onChangeText={onChange}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {form.formState.errors.title?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        <Controller
          control={form.control}
          name="address"
          render={({ field: { value, onChange } }) => (
            <FormControl
              className="mb-5"
              isInvalid={Boolean(form.formState.errors.address?.message)}
            >
              <FormControlLabel>
                <FormControlLabelText>Alamat</FormControlLabelText>
              </FormControlLabel>
              <Textarea size="md">
                <TextareaInput
                  value={value}
                  readOnly={compose.isPending || complaint.isFetching}
                  //   readOnly={login.isPending}
                  onChangeText={onChange}
                />
              </Textarea>
              <FormControlError>
                <FormControlErrorText>
                  {form.formState.errors.address?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <FormControl
              className="mb-5"
              isInvalid={Boolean(form.formState.errors.description?.message)}
            >
              <FormControlLabel>
                <FormControlLabelText>Penjelasan</FormControlLabelText>
              </FormControlLabel>
              <Textarea size="md" className="h-64">
                <TextareaInput
                  value={value}
                  readOnly={compose.isPending || complaint.isFetching}
                  //   readOnly={login.isPending}
                  onChangeText={onChange}
                />
              </Textarea>
              <FormControlError>
                <FormControlErrorText>
                  {form.formState.errors.description?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
      </Box>
    </KeyboardAvoidingView>
  );
}
