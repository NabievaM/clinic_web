import api from "@/plugins/axios";

export const fetchMe = () => api.get("/user/me");
export const updateUser = (id, payload) =>
  api.put(`/user/${id}/update`, payload);
export const fetchAll = () => api.get("/user/all");
export const deleteUser = (id) => api.delete(`/user/${id}/delete`);
export const searchUsers = (keyword) =>
  api.get(`/user/search?keyword=${keyword}`);
export const getUserById = (id) => api.get(`/user/${id}`);
