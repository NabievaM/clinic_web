import api from "@/plugins/axios";

export const fetchDashboardSummary = () => api.get("/dashboard/summary");
