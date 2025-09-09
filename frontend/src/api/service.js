import api from "@/plugins/axios";

export const getAllServices = () => {
  return api.get("/service/all");
};
