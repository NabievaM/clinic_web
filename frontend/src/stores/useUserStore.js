import { defineStore } from "pinia";
import { fetchMe } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getMe() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchMe();
        this.user = data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
