import { deleteComplaintClient, getComplaintClient } from "@/api/complaint";
import { formatBytes } from "@/api/upload";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { statusLookup } from "@/constants/Status";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import moment from "moment";
import { FlatList, RefreshControl } from "react-native";

export default function Detail() {
  const param = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const complaint = useQuery({
    queryKey: [`complaint-${param.id}`],
    queryFn: () => (param.id ? getComplaintClient(param.id) : null),
  });

  const remove = useMutation({
    mutationFn: deleteComplaintClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["complaints"] });
      navigation.goBack();
    },
  });

  return (
    <>
      <FlatList
        className="flex-1"
        data={[]}
        keyExtractor={(_, index) => `${index}`}
        renderItem={() => null}
        refreshControl={
          <RefreshControl
            refreshing={complaint.isLoading}
            onRefresh={() => complaint.refetch()}
          />
        }
        ListHeaderComponent={
          <>
            <Box className="flex-row items-center p-5">
              {complaint.data?.status ? (
                <Text
                  className={
                    complaint.data.status === "RESOLVED"
                      ? "bg-green-500 text-white py-1 px-2 text-sm mr-2 rounded"
                      : complaint.data.status === "SENT"
                      ? "bg-white text-neutral-700 py-1 px-2 text-sm mr-2 rounded"
                      : complaint.data.status === "RECEIVED"
                      ? "bg-neutral-800 text-white py-1 px-2 text-sm mr-2 rounded"
                      : complaint.data.status === "HANDLED"
                      ? "bg-yellow-500 text-neutral-700 py-1 px-2 text-sm mr-2 rounded"
                      : complaint.data.status === "ON_PROGRESS"
                      ? "bg-blue-500 text-white py-1 px-2 text-sm mr-2 rounded"
                      : ""
                  }
                >
                  {
                    statusLookup[
                      complaint.data?.status as keyof typeof statusLookup
                    ]
                  }
                </Text>
              ) : null}

              <Text className="font-normal text-typography-700">
                {moment(complaint.data?.createdAt).format("DD MMMM YYYY")}
              </Text>
            </Box>
            <VStack className="mb-6 p-5 pt-0">
              <Heading size="xl" className="mb-4">
                {complaint.data?.title}
              </Heading>
              <Box className="flex-row border-b border-neutral-300">
                <Feather name="map-pin" className="mt-1 mr-2" />
                <Text size="md" className="mb-5 flex-1">
                  {complaint.data?.address}
                </Text>
              </Box>
              <Text size="md" className="pt-5">
                {complaint.data?.description}
              </Text>
            </VStack>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={complaint.data?.pics || []}
              keyExtractor={(item) => item.id}
              contentContainerClassName="gap-5 p-5 pt-0"
              horizontal
              renderItem={({ item }) => (
                <Box className="p-3 rounded-md bg-white w-64">
                  <Image
                    source={{
                      uri:
                        process.env.EXPO_PUBLIC_BASE_URL +
                        "/uploads" +
                        item.file.url,
                    }}
                    className="bg-white h-64 w-full rounded-md"
                    resizeMode="cover"
                    alt={item.file.name}
                  />
                  <Box className="mt-2">
                    <Text className="font-bold text-sm" numberOfLines={1}>
                      {item.file.name}
                    </Text>
                    <Text className="text-sm">
                      {formatBytes(item.file.size || 0)}
                    </Text>
                  </Box>
                </Box>
              )}
            />
          </>
        }
      />
      {complaint.data?.status === "SENT" ? (
        <Box className="p-5 pb-12 flex-row gap-5">
          <Link
            href={{
              pathname: "/(protected)/compose",
              params: { id: complaint.data!.id },
            }}
            asChild
          >
            <Button className="flex-1">
              <ButtonText>Edit</ButtonText>
            </Button>
          </Link>
          <Button
            onPress={() => remove.mutate(complaint.data!.id)}
            className="flex-1 bg-red-500 text-white"
          >
            {remove.isPending && <ButtonSpinner color={"white"} />}
            <ButtonText>Hapus</ButtonText>
          </Button>
        </Box>
      ) : null}
    </>
  );
}
