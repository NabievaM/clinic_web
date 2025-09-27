import api from "@/plugins/axios";

export const fetchBanners = () => api.get("/banner/all");
export const fetchBannerById = (id) => api.get(`/banner/${id}`);
