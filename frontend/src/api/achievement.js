import api from "@/plugins/axios";

export const fetchAchievements = () => api.get("/achievement/all");

export const fetchAchievementById = (id) => api.get(`/achievement/${id}`);

export const createAchievement = (formData) =>
  api.post("/achievement/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateAchievement = (id, data) =>
  api.patch(`/achievement/${id}`, data);

export const updateAchievementImage = (id, formData) =>
  api.patch(`/achievement/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteAchievement = (id) => api.delete(`/achievement/${id}`);