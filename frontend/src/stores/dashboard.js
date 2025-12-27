import { defineStore } from "pinia";
import { fetchDashboardSummary } from "@/api/dashboard";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    summary: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getSummary() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchDashboardSummary();
        this.summary = data;
        return data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Dashboard maʼlumotlarini olishda xatolik";
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    clearSummary() {
      this.summary = null;
    },
  },
});
