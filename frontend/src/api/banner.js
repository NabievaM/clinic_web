import api from "@/plugins/axios";

export const fetchBanners = () => api.get("/banner/all");
