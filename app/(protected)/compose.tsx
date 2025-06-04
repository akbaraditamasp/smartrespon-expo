import {
  composeComplaintClient,
  composeComplaintValidation,
  getComplaintClient,
} from "@/api/complaint";
import { formatBytes } from "@/api/upload";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { AddIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { z } from "zod";

export default function ComposeComplaint() {
  const param = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [actionOpened, setActionOpened] = useState(false);

  const form = useForm<z.infer<typeof composeComplaintValidation>>({
    resolver: zodResolver(composeComplaintValidation),
  });

  const pics = useFieldArray({
    control: form.control,
    name: "pics",
    keyName: "__id",
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

  const pickImage = async (
    setter: (
      file: z.infer<typeof composeComplaintValidation>["pics"][number]
    ) => void
  ) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setter({
        url: result.assets[0].uri,
        name: result.assets[0].fileName || "image.jpeg",
        type: result.assets[0].mimeType || "image/jpeg",
        size: result.assets[0].fileSize || 0,
      });
    }
  };

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
        id: complaint.data.id,
        address: complaint.data.address,
        description: complaint.data.description,
        title: complaint.data.title,
        pics: complaint.data.pics?.map((item) => ({
          id: item.id,
          name: item.file.name,
          size: item.file.size,
          type: item.file.type,
          url: item.file.url,
        })),
      });
    }
  }, [complaint.data]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : undefined}
        style={{ flex: 1 }}
      >
        <Box className="flex-1 bg-white">
          <Controller
            control={form.control}
            name="title"
            render={({ field: { value, onChange } }) => (
              <FormControl
                isInvalid={Boolean(form.formState.errors.title?.message)}
              >
                <Input size="md" variant="underlined" className="px-5 h-12">
                  <InputSlot />
                  <InputField
                    value={value}
                    readOnly={compose.isPending || complaint.isFetching}
                    //   readOnly={login.isPending}
                    onChangeText={onChange}
                    placeholder="Judul"
                  />
                </Input>
              </FormControl>
            )}
          />
          <Controller
            control={form.control}
            name="address"
            render={({ field: { value, onChange } }) => (
              <FormControl
                isInvalid={Boolean(form.formState.errors.title?.message)}
              >
                <Input
                  size="md"
                  variant="underlined"
                  className="px-5 py-5 h-20"
                >
                  <InputSlot />
                  <InputField
                    multiline
                    value={value}
                    readOnly={compose.isPending || complaint.isFetching}
                    //   readOnly={login.isPending}
                    onChangeText={onChange}
                    placeholder="Alamat"
                  />
                </Input>
              </FormControl>
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field: { value, onChange } }) => (
              <FormControl
                className="flex-1"
                isInvalid={Boolean(form.formState.errors.title?.message)}
              >
                <Input
                  size="md"
                  variant="underlined"
                  className="px-5 py-5 h-20 flex-1"
                >
                  <InputSlot />
                  <InputField
                    multiline
                    value={value}
                    readOnly={compose.isPending || complaint.isFetching}
                    //   readOnly={login.isPending}
                    onChangeText={onChange}
                    placeholder="Isi Pengaduan"
                  />
                </Input>
              </FormControl>
            )}
          />
        </Box>
        <Box className="bg-neutral-100 pt-5">
          <FlatList
            data={pics.fields}
            contentContainerClassName="px-5 items-center"
            horizontal
            keyExtractor={(item) => `${item.__id}`}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={null}
            renderItem={({ item, index }) => (
              <Box
                className={
                  "bg-white rounded-md h-20 w-56 p-5 flex-row items-center mb-5 relative mt-2 " +
                  (index !== 0 ? "ml-5" : "")
                }
              >
                <Text className="text-blue-600">
                  <AntDesign name="picture" size={24} />
                </Text>
                <Box className="flex-1 ml-3">
                  <Text className="font-bold text-sm" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-sm">{formatBytes(item.size || 0)}</Text>
                </Box>
                <TouchableOpacity
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full justify-center items-center"
                  onPress={() => pics.remove(index)}
                >
                  <AntDesign name="close" color="white" />
                </TouchableOpacity>
              </Box>
            )}
          />
          <Box className="px-5 pb-10">
            <Button onPress={() => pickImage(pics.append)}>
              <ButtonIcon as={AddIcon} />
              <ButtonText>Lampirkan Gambar</ButtonText>
            </Button>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </>
  );
}
