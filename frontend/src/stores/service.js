import { defineStore } from "pinia";
import { getAllServices, createService } from "../api/service";

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
    async addService(data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await createService(data);
        this.services.push(res.data);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
