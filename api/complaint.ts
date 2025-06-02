import { z } from "zod";
import { Base } from "./base";
import client from "./client";
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
}>;

export const composeComplaintValidation = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  address: z.string().nonempty(),
});

export const composeComplaintClient = (
  payload: z.infer<typeof composeComplaintValidation>
): Promise<ComplaintModel> => {
  const form = new FormData();

  for (const key of Object.keys(payload)) {
    form.append(key, payload[key as keyof typeof payload]);
  }

  form.append("coordinates[latitude]", "0");
  form.append("coordinates[longitude]", "0");

  return client.post("/complaint", form).then(({ data }) => data.data);
};

export const indexComplaintClient = (): Promise<ComplaintModel[]> =>
  client.get("/complaint").then(({ data }) => data.data);

export const getComplaintClient = (id: string): Promise<ComplaintModel> =>
  client.get(`/complaint/${id}`).then(({ data }) => data.data);
