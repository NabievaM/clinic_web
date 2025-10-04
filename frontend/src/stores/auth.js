import { defineStore } from "pinia";
import { registerUser, loginUser, fetchMe } from "@/api/auth";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem("access_token") || null,
    loading: false,
  }),

  actions: {
    async register(payload) {
      this.loading = true;
      try {
        const { data } = await registerUser(payload);
        this.user = data.user;
        this.accessToken = data.tokens.access_token;

        localStorage.setItem("access_token", this.accessToken);

        return true;
      } catch (err) {
        throw (
          err.response?.data || {
            message: "Ro‘yxatdan o‘tishda xatolik yuz berdi.",
          }
        );
      } finally {
        this.loading = false;
      }
    },

    async login(payload) {
      this.loading = true;
      try {
        const { data } = await loginUser(payload);
        this.accessToken = data.tokens.access_token;

        localStorage.setItem("access_token", this.accessToken);

        const user = await this.fetchUser();

        if (user?.role === "admin") {
          await router.push("/admin/dashboard");
        } else {
          await router.push("/");
        }

        return true;
      } catch (err) {
        throw {
          message:
            err.response?.data?.message ??
            "Tizimga kirishda xatolik yuz berdi.",
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.accessToken) return null;
      try {
        const { data } = await fetchMe();
        this.user = data;
        return data;
      } catch (err) {
        this.logout();
        return null;
      }
    },

    async logout() {
      this.user = null;
      this.accessToken = null;
      localStorage.removeItem("access_token");
      await router.push("/login");
    },
  },
});
