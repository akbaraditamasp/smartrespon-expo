import axios from "axios";
import { z } from "zod";

const client = axios.create({
  baseURL: "http://192.168.1.111:3000/public",
});

export const metaDataValidation = z.object({
  perPage: z.number().min(1).max(200).optional().default(50),
  page: z.number().min(1).optional().default(1),
  search: z.string().optional(),
});

export default client;
