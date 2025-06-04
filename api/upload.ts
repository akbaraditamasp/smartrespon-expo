export type UploadModel = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
};

export const toFile = (file: {
  uri: string;
  type: string;
  name: string;
  size: number;
}) => file as unknown as File;

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}
