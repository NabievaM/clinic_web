import api from "@/plugins/axios";

export const fetchSpecialist = () => api.get("/specialist/all");
export const fetchByIdSpecialist = (id) => api.get(`/specialist/${id}`);
export const createSpecialist = (formData) =>
  api.post("/specialist/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
