import { defineStore } from "pinia";
import {
  createSpecialistService,
  fetchSpecialistsByService,
} from "@/api/specialistService";

export const useSpecialistServiceStore = defineStore("specialistService", {
  state: () => ({
    specialists: [],
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
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async createMapping(payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await createSpecialistService(payload);
        return data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
