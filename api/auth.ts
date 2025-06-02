import z from "zod";
import client from "./client";
import { UserModel } from "./user";

export const loginValidation = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty(),
});

export const registerValidation = z
  .object({
    fullname: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().nonempty(),
    repeatPassword: z.string().nonempty(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Password not match",
    path: ["repeatPassword"],
  });

export const loginClient = (
  data: z.infer<typeof loginValidation>
): Promise<UserModel & { token: string }> =>
  client.post("/auth/login", data).then(({ data }) => data.data);

export const registerClient = ({
  repeatPassword: _,
  ...data
}: z.infer<typeof registerValidation>): Promise<
  UserModel & { token: string }
> => client.post("/auth/register", data).then(({ data }) => data.data);

export const checkTokenClient = (token: string): Promise<UserModel> =>
  client
    .get("/auth/check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => data.data);

export const logoutClient = (): Promise<UserModel> =>
  client.delete("/logout").then(({ data }) => data.data);
