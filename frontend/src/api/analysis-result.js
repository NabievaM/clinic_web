import api from "@/plugins/axios";

export const fetchAnalysisResults = () => api.get("/analysis-result/all");

export const fetchAnalysisResultById = (id) =>
  api.get(`/analysis-result/${id}`);

export const createAnalysisResult = (formData) =>
  api.post("/analysis-result/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
