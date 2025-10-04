import api from "@/plugins/axios";

export const getAllServices = () => {
  return api.get("/service/all");
};

export const createService = (data) => {
  return api.post("/service/create", data);
};
