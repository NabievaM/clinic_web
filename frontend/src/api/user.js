import api from "@/plugins/axios";

export const fetchMe = () => api.get("/user/me");
