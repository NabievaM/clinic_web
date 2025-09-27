import { defineStore } from "pinia";
import { fetchMe, updateUser, fetchAll } from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    users: [],
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
        this.error =
          err.response?.data?.message || err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },

    async getAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchAll();
        this.users = data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Userlarni olishda xato";
      } finally {
        this.loading = false;
      }
    },

    async updateMyProfile(payload) {
      if (!this.user?.id) {
        return { ok: false, message: "Foydalanuvchi aniqlanmadi" };
      }
      this.loading = true;
      this.error = null;
      try {
        const { data } = await updateUser(this.user.id, payload);
        this.user = data.user;
        return { ok: true, message: data.message };
      } catch (err) {
        const msg = err.response?.data?.message || "Yangilashda xato";
        this.error = msg;
        return { ok: false, message: msg };
      } finally {
        this.loading = false;
      }
    },
  },
});
