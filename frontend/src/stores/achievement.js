import { defineStore } from "pinia";
import { fetchAchievements, fetchAchievementById } from "@/api/achievement";

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
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async getAchievement(id) {
      this.loading = true;
      this.error = null;
      this.achievement = null;
      try {
        const { data } = await fetchAchievementById(id);
        this.achievement = data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
