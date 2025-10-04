import { defineStore } from "pinia";
import {
  fetchSpecialist,
  fetchByIdSpecialist,
  createSpecialist,
} from "@/api/specialist";

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
        this.error =
          err.response?.data?.message || err.message || "Nimadir xato ketdi";
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
        this.error =
          err.response?.data?.message || err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async addSpecialist(data) {
      this.loading = true;
      this.error = null;
      try {
        let payload;
        if (data instanceof FormData) {
          payload = data;
        } else {
          payload = new FormData();
          for (const key of Object.keys(data || {})) {
            const value = data[key];
            if (value === undefined || value === null) continue;
            payload.append(key, value);
          }
        }

        const res = await createSpecialist(payload);
        this.specialists.unshift(res.data);
        return res.data;
      } catch (err) {
        const serverMessage = err.response?.data?.message;
        let message = "Yangi mutaxassis qo‘shishda xatolik";
        if (serverMessage) {
          if (Array.isArray(serverMessage)) {
            message = serverMessage.join(", ");
          } else if (typeof serverMessage === "string") {
            message = serverMessage;
          } else {
            message = JSON.stringify(serverMessage);
          }
        } else if (err.message) {
          message = err.message;
        }
        this.error = message;
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
