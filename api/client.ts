import axios from "axios";
import { z } from "zod";

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL + "/public",
});

export const metaDataValidation = z.object({
  perPage: z.number().min(1).max(200).optional().default(50),
  page: z.number().min(1).optional().default(1),
  search: z.string().optional(),
});

export default client;
