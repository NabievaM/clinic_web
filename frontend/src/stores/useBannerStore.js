import { defineStore } from "pinia";
import { fetchBanners, fetchBannerById } from "@/api/banner";

export const useBannerStore = defineStore("banner", {
  state: () => ({
    banners: [],
    banner: null,
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

    async getBanner(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchBannerById(id);
        this.banner = data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
