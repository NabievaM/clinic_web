import api from "@/plugins/axios";

export const fetchClinic = () => api.get("/clinic-setting/all");

export const updateClinic = (id, data) =>
  api.patch(`/clinic-setting/${id}`, data);

export const updateClinicLogo = (id, data) =>
  api.patch(`/clinic-setting/${id}/logo`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
