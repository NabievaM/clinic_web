import api from "@/plugins/axios";

export const createSpecialistService = (payload) =>
  api.post("/specialist-service/create", payload);

export const fetchAllSpecialistServices = () =>
  api.get("/specialist-service/all");

export const fetchSpecialistsByService = (serviceId) =>
  api.get(`/specialist-service/service/${serviceId}/specialists`);

export const fetchServicesBySpecialist = (specialistId) =>
  api.get(`/specialist-service/specialist/${specialistId}/services`);

export const fetchSpecialistServiceById = (id) =>
  api.get(`/specialist-service/${id}`);

export const deleteSpecialistService = (id) =>
  api.delete(`/specialist-service/${id}`);

export const deleteByPair = (specialistId, serviceId) =>
  api.delete(
    `/specialist-service/specialist/${specialistId}/service/${serviceId}`
  );
