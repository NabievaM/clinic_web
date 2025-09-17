import api from "@/plugins/axios";

export const createSpecialistService = (payload) =>
  api.post("/specialist-service/create", payload);

export const fetchSpecialistsByService = (serviceId) =>
  api.get(`/specialist-service/service/${serviceId}/specialists`);
