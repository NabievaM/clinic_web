import { defineStore } from "pinia";
import { fetchBanners } from "@/api/banner";

export const useBannerStore = defineStore("banner", {
  state: () => ({
    banners: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getBanners() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchBanners();
        this.banners = data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
