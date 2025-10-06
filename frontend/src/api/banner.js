import api from "@/plugins/axios";

export const fetchBanners = () => api.get("/banner/all");
export const fetchBannerById = (id) => api.get(`/banner/${id}`);

export const createBanner = (formData) =>
  api.post("/banner/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBanner = (id, data) => api.patch(`/banner/${id}`, data);

export const updateBannerImage = (id, formData) =>
  api.patch(`/banner/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBanner = (id) => api.delete(`/banner/${id}`);
