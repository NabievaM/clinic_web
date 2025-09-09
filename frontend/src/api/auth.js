import api from "@/plugins/axios";

export const registerUser = (data) => api.post("/user/register", data);
export const loginUser = (data) => api.post("/user/login", data);
export const fetchMe = () => api.get("/user/me");
