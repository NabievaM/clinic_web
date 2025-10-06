import { defineStore } from "pinia";
import {
  createClinicSetting,
  fetchClinicSettings,
  fetchClinicSettingById,
  updateClinicSetting,
  updateClinicLogo,
  deleteClinicLogo,
  deleteClinicSetting,
} from "@/api/clinic-setting";

export const useClinicStore = defineStore("clinic", {
  state: () => ({
    clinics: [],
    clinic: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getClinic() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchClinicSettings();
        this.clinic = res.data[0];
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async getClinicById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchClinicSettingById(id);
        this.clinic = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async createClinic(data) {
      this.loading = true;
      this.error = null;
      try {
        await createClinicSetting(data);
        await this.getClinics();
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
        await updateClinicSetting(id, data);
        await this.getClinics();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async updateLogo(id, data) {
      this.loading = true;
      this.error = null;
      try {
        await updateClinicLogo(id, data);
        await this.getClinics();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async removeLogo(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteClinicLogo(id);
        await this.getClinics();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async removeClinic(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteClinicSetting(id);
        await this.getClinics();
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
