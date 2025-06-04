import { UploadModel } from "./upload";

export type ComplaintPicModel = {
  id: string;
  complaintId: string;
  file: UploadModel;
};
