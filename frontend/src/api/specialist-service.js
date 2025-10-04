import api from "@/plugins/axios";

export const createSpecialistService = (payload) =>
  api.post("/specialist-service/create", payload);

export const fetchAllSpecialistServices = () =>
  api.get("/specialist-service/all");

export const fetchSpecialistsByService = (serviceId) =>
  api.get(`/specialist-service/service/${serviceId}/specialists`);

export const fetchSpecialistServiceById = (id) =>
  api.get(`/specialist-service/${id}`);
