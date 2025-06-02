import { indexComplaintClient } from "@/api/complaint";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { AddIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import moment from "moment";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";

export default function Home() {
  const complaints = useQuery({
    queryKey: ["complaints"],
    queryFn: indexComplaintClient,
  });

  return (
    <Box className="flex-1 bg-neutral-50">
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={complaints.isLoading}
            onRefresh={() => complaints.refetch()}
          />
        }
        data={complaints.data || []}
        style={{ flex: 1 }}
        keyExtractor={(_item, index) => `${index}`}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/(protected)/compose", params: { id: item.id } }}
            asChild
          >
            <TouchableOpacity>
              <Card className="p-5 rounded-lg m-3">
                <Text className="text-sm font-normal mb-2 text-typography-700">
                  {moment(item.createdAt).format("DD MMMM YYYY")}
                </Text>
                <VStack className="mb-6">
                  <Heading size="md" className="mb-4">
                    {item.title}
                  </Heading>
                  <Text size="sm">{item.address}</Text>
                </VStack>
              </Card>
            </TouchableOpacity>
          </Link>
        )}
      />
      <Link asChild href="/(protected)/compose">
        <Fab size="lg" placement="bottom right">
          <FabIcon as={AddIcon} />
          <FabLabel>Kirim Baru</FabLabel>
        </Fab>
      </Link>
    </Box>
  );
}
