import api from "@/plugins/axios";

export const fetchAchievements = () => api.get("/achievement/all");
export const fetchAchievementById = (id) => api.get(`/achievement/${id}`);
