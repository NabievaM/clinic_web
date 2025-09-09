import { defineStore } from "pinia";
import { fetchClinicSetting } from "@/api/clinic-setting";

export const useClinicStore = defineStore("clinic", {
  state: () => ({
    clinic: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getClinic() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchClinicSetting();
        this.clinic = res.data[0];
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
