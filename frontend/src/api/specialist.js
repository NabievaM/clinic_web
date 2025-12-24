import api from "@/plugins/axios";

export const fetchSpecialists = () => api.get("/specialist/all");

export const fetchSpecialistById = (id) => api.get(`/specialist/${id}`);

export const createSpecialist = (formData) =>
  api.post("/specialist/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateSpecialist = (id, data) =>
  api.patch(`/specialist/${id}`, data);

export const updateSpecialistPhoto = (id, formData) =>
  api.patch(`/specialist/${id}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteSpecialistPhoto = (id) =>
  api.delete(`/specialist/${id}/photo`);

export const deleteSpecialist = (id) => api.delete(`/specialist/${id}`);
