import api from "@/plugins/axios";

export const getAllServices = () => api.get("/service/all");

export const getServiceById = (id) => api.get(`/service/${id}`);

export const createService = (data) => api.post("/service/create", data);

export const updateService = (id, data) => api.patch(`/service/${id}`, data);

export const deleteServiceById = (id) => api.delete(`/service/${id}`);
