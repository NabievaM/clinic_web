import { defineStore } from "pinia";
import { fetchAchievements } from "@/api/achievement";

export const useAchievementStore = defineStore("achievement", {
  state: () => ({
    achievements: [],
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
  },
});
