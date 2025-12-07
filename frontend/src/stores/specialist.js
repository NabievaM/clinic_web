import { defineStore } from "pinia";
import {
  fetchSpecialists,
  fetchSpecialistById,
  createSpecialist,
  updateSpecialist,
  updateSpecialistPhoto,
  deleteSpecialist,
  deleteSpecialistPhoto,
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
        const res = await fetchSpecialists();
        this.specialists = res.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Mutaxassislarni yuklashda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async getSpecialistById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchSpecialistById(id);
        this.specialist = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Mutaxassis topilmadi";
      } finally {
        this.loading = false;
      }
    },

    async add(data) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        for (const key in data) {
          if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        }

        const res = await createSpecialist(formData);
        this.specialists.unshift(res.data);
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Yangi mutaxassis qo‘shishda xatolik";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async update(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await updateSpecialist(id, data);
        const idx = this.specialists.findIndex((s) => s.id === id);
        if (idx !== -1) this.specialists[idx] = res.data;
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Yangilashda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async updatePhoto(id, photoFile) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const res = await updateSpecialistPhoto(id, formData);
        const idx = this.specialists.findIndex((s) => s.id === id);
        if (idx !== -1) this.specialists[idx] = res.data;
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Rasmni yangilashda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async removePhoto(id) {
      this.loading = true;
      try {
        const res = await deleteSpecialistPhoto(id);
        const idx = this.specialists.findIndex((s) => s.id === id);
        if (idx !== -1) this.specialists[idx] = res.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Rasmni o‘chirishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async remove(id) {
      this.loading = true;
      try {
        await deleteSpecialist(id);
        this.specialists = this.specialists.filter((s) => s.id !== id);
      } catch (err) {
        this.error = err.response?.data?.message || "O‘chirishda xatolik";
      } finally {
        this.loading = false;
      }
    },
  },
});
