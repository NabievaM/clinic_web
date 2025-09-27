import { defineStore } from "pinia";
import { fetchStatistics } from "@/api/statistic";

export const useStatisticsStore = defineStore("statistics", {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getStatistics() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchStatistics();
        this.list = data;
      } catch (err) {
        this.error = err.response?.data?.message || "Xatolik yuz berdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
