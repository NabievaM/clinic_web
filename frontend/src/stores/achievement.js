import { defineStore } from "pinia";
import {
  fetchAchievements,
  fetchAchievementById,
  createAchievement,
  updateAchievement,
  updateAchievementImage,
  deleteAchievement,
} from "@/api/achievement";

export const useAchievementStore = defineStore("achievement", {
  state: () => ({
    achievements: [],
    achievement: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getAchievements() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchAchievements();
        this.achievements = data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Yutuqlarni olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async getAchievement(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchAchievementById(id);
        this.achievement = data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Yutuqni olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async addAchievement(data) {
      this.loading = true;
      this.error = null;
      try {
        let formData = data instanceof FormData ? data : new FormData();
        if (!(data instanceof FormData)) {
          for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
              formData.append(key, data[key]);
            }
          }
        }

        const res = await createAchievement(formData);
        this.achievements.unshift(res.data);
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Yutuq yaratishda xatolik";
        this.error = Array.isArray(msg) ? msg.join(", ") : msg;
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async editAchievement(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const { data: updated } = await updateAchievement(id, data);
        const index = this.achievements.findIndex((a) => a.id === id);
        if (index !== -1) this.achievements[index] = updated;
        this.achievement = updated;
        return updated;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Yutuqni yangilashda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async changeAchievementImage(id, file) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await updateAchievementImage(id, formData);

        const index = this.achievements.findIndex((a) => a.id === id);
        if (index !== -1) this.achievements[index].image = data.image;

        this.achievement = data;
        return data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Rasmni yangilashda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async removeAchievement(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteAchievement(id);
        this.achievements = this.achievements.filter((a) => a.id !== id);
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Yutuqni o‘chirishda xatolik";
      } finally {
        this.loading = false;
      }
    },
  },
});
