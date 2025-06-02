export type Base<T = {}> = {
  createdAt: string;
  updatedAt: string;
} & T;
