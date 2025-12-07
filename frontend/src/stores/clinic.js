import { defineStore } from "pinia";
import {
  fetchClinic,
  updateClinic,
  updateClinicLogo,
} from "@/api/clinic-setting";

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
        const res = await fetchClinic();
        this.clinic =
          Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async updateClinic(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await updateClinic(id, data);
        await this.getClinic();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async updateClinicLogo(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await updateClinicLogo(id, data);
        await this.getClinic();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
