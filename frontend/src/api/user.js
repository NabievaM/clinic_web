import api from "@/plugins/axios";

export const fetchMe = () => api.get("/user/me");
export const updateUser = (id, payload) =>
  api.put(`/user/${id}/update`, payload);
