import { defineStore } from "pinia";
import {
  fetchAnalysisResults,
  fetchAnalysisResultById,
  createAnalysisResult,
} from "@/api/analysis-result";

export const useAnalysisResultStore = defineStore("analysis_result", {
  state: () => ({
    results: [],
    result: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getResults() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchAnalysisResults();
        this.results = res.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async getResultById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchAnalysisResultById(id);
        this.result = res.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async addResult(data) {
      this.loading = true;
      this.error = null;
      try {
        let payload;
        if (data instanceof FormData) {
          payload = data;
        } else {
          payload = new FormData();
          for (const key of Object.keys(data || {})) {
            const value = data[key];
            if (value === undefined || value === null) continue;
            payload.append(key, value);
          }
        }

        const res = await createAnalysisResult(payload);
        this.results.unshift(res.data);
        return res.data;
      } catch (err) {
        const serverMessage = err.response?.data?.message;
        let message = "Natija qo‘shishda xatolik";
        if (serverMessage) {
          if (Array.isArray(serverMessage)) {
            message = serverMessage.join(", ");
          } else if (typeof serverMessage === "string") {
            message = serverMessage;
          } else {
            message = JSON.stringify(serverMessage);
          }
        } else if (err.message) {
          message = err.message;
        }
        this.error = message;
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
