import api from "@/plugins/axios";

export const sendUserMessage = (data) =>
  api.post("/user-message/send", data);

export const fetchUserMessages = () => api.get("/user-message/all");

export const fetchUserMessageById = (id) => api.get(`/user-message/${id}`);

export const deleteUserMessage = (id) => api.delete(`/user-message/${id}`);
