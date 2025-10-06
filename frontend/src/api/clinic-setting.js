import api from "@/plugins/axios";

export const createClinicSetting = (data) =>
  api.post("/clinic-setting/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchClinicSettings = () => api.get("/clinic-setting/all");

export const fetchClinicSettingById = (id) => api.get(`/clinic-setting/${id}`);

export const updateClinicSetting = (id, data) =>
  api.put(`/clinic-setting/${id}`, data);

export const updateClinicLogo = (id, data) =>
  api.put(`/clinic-setting/${id}/logo`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteClinicLogo = (id) =>
  api.delete(`/clinic-setting/${id}/logo`);

export const deleteClinicSetting = (id) => api.delete(`/clinic-setting/${id}`);
