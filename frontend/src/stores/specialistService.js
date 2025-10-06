import { defineStore } from "pinia";
import {
  createSpecialistService,
  fetchAllSpecialistServices,
  fetchSpecialistsByService,
  fetchServicesBySpecialist,
  fetchSpecialistServiceById,
  deleteSpecialistService,
  deleteByPair,
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

    async deleteMapping(id) {
      this.error = null;
      try {
        await deleteSpecialistService(id);
        await this.getAllSpecialists();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async deleteMappingByPair(specialistId, serviceId) {
      this.error = null;
      try {
        await deleteByPair(specialistId, serviceId);
        await this.getAllSpecialists();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async getServicesBySpecialist(specialistId) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchServicesBySpecialist(specialistId);
        this.services = data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
