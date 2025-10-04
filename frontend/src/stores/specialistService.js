import { defineStore } from "pinia";
import {
  createSpecialistService,
  fetchSpecialistsByService,
  fetchSpecialistServiceById,
  fetchAllSpecialistServices,
} from "@/api/specialist-service";

export const useSpecialistServiceStore = defineStore("specialistService", {
  state: () => ({
    specialists: [],
    selected: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getSpecialists(serviceId) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchSpecialistsByService(serviceId);
        this.specialists = data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async getAllSpecialists() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchAllSpecialistServices();
        this.specialists = data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchMapping(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchSpecialistServiceById(id);
        this.selected = data;
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createMapping(payload) {
      this.error = null;
      try {
        await createSpecialistService(payload);
        await this.getAllSpecialists();
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Noma'lum xato yuz berdi";
        return false;
      }
    },
  },
});
