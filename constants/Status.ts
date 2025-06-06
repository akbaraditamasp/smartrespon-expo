import { ComplaintModel } from "@/api/complaint";

export const statusLookup: Record<ComplaintModel["status"], string> = {
  SENT: "TERKIRIM",
  RECEIVED: "DITERIMA",
  HANDLED: "DITANGANI",
  ON_PROGRESS: "SEDANG DIPROSES",
  RESOLVED: "SELESAI",
};
