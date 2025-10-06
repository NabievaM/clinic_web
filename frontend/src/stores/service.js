import { defineStore } from "pinia";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteServiceById,
} from "@/api/service";

export const useServiceStore = defineStore("service", {
  state: () => ({
    services: [],
    service: null,
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
    async fetchServiceById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await getServiceById(id);
        this.service = res.data;
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
        this.services.unshift(res.data);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async editService(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await updateService(id, data);
        const index = this.services.findIndex((s) => s.id === id);
        if (index !== -1) this.services[index] = res.data;
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async removeService(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteServiceById(id);
        this.services = this.services.filter((s) => s.id !== id);
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
