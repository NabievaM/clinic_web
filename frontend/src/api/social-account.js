import api from "@/plugins/axios";

export const fetchSocialAccounts = () => api.get("/social-account/all");
export const fetchSocialAccountById = (id) => api.get(`/social-account/${id}`);
export const createSocialAccount = (data) =>
  api.post("/social-account/create", data);
export const updateSocialAccount = (id, data) =>
  api.put(`/social-account/${id}`, data);
export const deleteSocialAccount = (id) => api.delete(`/social-account/${id}`);
