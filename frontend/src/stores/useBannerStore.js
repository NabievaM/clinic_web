import { defineStore } from "pinia";
import {
  fetchBanners,
  fetchBannerById,
  createBanner,
  updateBanner,
  updateBannerImage,
  deleteBanner,
} from "@/api/banner";

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

    async addBanner(data) {
      this.loading = true;
      this.error = null;
      try {
        let payload = data instanceof FormData ? data : new FormData();
        if (!(data instanceof FormData)) {
          for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
              payload.append(key, data[key]);
            }
          }
        }
        const res = await createBanner(payload);
        this.banners.unshift(res.data);
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Banner qo‘shishda xatolik!";
        this.error = msg;
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async editBanner(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await updateBanner(id, data);
        const index = this.banners.findIndex((b) => b.id === id);
        if (index !== -1) this.banners[index] = res.data;
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Banner yangilashda xatolik!";
        this.error = msg;
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async editBannerImage(id, file) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await updateBannerImage(id, formData);
        const index = this.banners.findIndex((b) => b.id === id);
        if (index !== -1) this.banners[index] = res.data;
        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Rasm yangilashda xatolik!";
        this.error = msg;
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async removeBanner(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteBanner(id);
        this.banners = this.banners.filter((b) => b.id !== id);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Banner o‘chirishda xatolik!";
        this.error = msg;
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },
  },
});
