import api from "@/plugins/axios";

export const fetchSocialAccounts = () => api.get("/social-account/all");
