import api from "@/plugins/axios";

export const fetchAchievements = () => api.get("/achievement/all");
