import { defineStore } from "pinia";
import { fetchSpecialist, fetchByIdSpecialist } from "@/api/specialist";

export const useSpecialistStore = defineStore("specialist", {
  state: () => ({
    specialists: [],
    specialist: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getSpecialists() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchSpecialist();
        this.specialists = res.data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async getSpecialistById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchByIdSpecialist(id);
        this.specialist = res.data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
