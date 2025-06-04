import { z } from "zod";
import { Base } from "./base";
import client from "./client";
import { ComplaintPicModel } from "./complain-pic";
import { toFile } from "./upload";
import { UserModel } from "./user";

export type ComplaintModel = {
  id: string;
  userId: string;
  title: string;
  description: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: "SENT" | "RECEIVED" | "ON_PROGRESS" | "HANDLED" | "RESOLVED";
} & Base<{
  user?: UserModel;
  pics?: ComplaintPicModel[];
}>;

export const composeComplaintValidation = z.object({
  id: z.string().optional(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  address: z.string().nonempty(),
  pics: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().url(),
      name: z.string().optional(),
      size: z.number().optional(),
      type: z.string().optional(),
    })
  ),
});

export const composeComplaintClient = ({
  id,
  pics,
  ...payload
}: z.infer<typeof composeComplaintValidation>): Promise<ComplaintModel> => {
  const form = new FormData();

  for (const key of Object.keys(payload)) {
    form.append(key, payload[key as keyof typeof payload]);
  }

  for (const pic of pics) {
    if (!pic.id) {
      form.append(
        `pics[]`,
        toFile({
          uri: pic.url,
          name: pic.name || "image.jpg",
          size: pic.size || 0,
          type: pic.type || "image/jpeg",
        })
      );
    } else {
      form.append(`pics[]`, pic.id);
    }
  }

  form.append("coordinates[latitude]", "0");
  form.append("coordinates[longitude]", "0");

  return client({
    method: id ? "PUT" : "POST",
    url: id ? `/complaint/${id}` : "/complaint",
    data: form,
  }).then(({ data }) => data.data);
};

export const indexComplaintClient = (): Promise<ComplaintModel[]> =>
  client.get("/complaint").then(({ data }) => data.data);

export const getComplaintClient = (id: string): Promise<ComplaintModel> =>
  client.get(`/complaint/${id}`).then(({ data }) => data.data);
