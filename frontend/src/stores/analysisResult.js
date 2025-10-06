import { defineStore } from "pinia";
import {
  fetchAnalysisResults,
  fetchAnalysisResultById,
  createAnalysisResult,
  updateAnalysisResult,
  deleteAnalysisResult,
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
          err.response?.data?.message ||
          err.message ||
          "Natijalarni olishda xatolik";
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
          err.response?.data?.message ||
          err.message ||
          "Natijani olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async addResult(data) {
      this.loading = true;
      this.error = null;
      try {
        const formData = data instanceof FormData ? data : new FormData();
        if (!(data instanceof FormData)) {
          for (const key of Object.keys(data || {})) {
            const value = data[key];
            if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          }
        }

        const res = await createAnalysisResult(formData);
        this.results.unshift(res.data);
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Natija yaratishda xatolik";
        this.error = Array.isArray(msg) ? msg.join(", ") : msg;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async updateResult(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const formData = data instanceof FormData ? data : new FormData();
        if (!(data instanceof FormData)) {
          for (const key of Object.keys(data || {})) {
            const value = data[key];
            if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          }
        }

        const res = await updateAnalysisResult(id, formData);
        const index = this.results.findIndex((r) => r.id === id);
        if (index !== -1) this.results[index] = res.data;
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Natijani yangilashda xatolik";
        this.error = Array.isArray(msg) ? msg.join(", ") : msg;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async deleteResult(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteAnalysisResult(id);
        this.results = this.results.filter((r) => r.id !== id);
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Natijani o‘chirishda xatolik";
      } finally {
        this.loading = false;
      }
    },
  },
});
