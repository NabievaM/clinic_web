import { defineStore } from "pinia";
import { getAllServices } from "../api/service";

export const useServiceStore = defineStore("service", {
  state: () => ({
    services: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchServices() {
      this.loading = true;
      this.error = null;
      try {
        const res = await getAllServices();
        this.services = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
