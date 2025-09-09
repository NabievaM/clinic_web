import { defineStore } from "pinia";
import { registerUser, loginUser } from "@/api/auth";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem("access_token") || null,
  }),
  actions: {
    async register(payload) {
      try {
        const { data } = await registerUser(payload);
        this.user = data.user;
        this.accessToken = data.tokens.access_token;

        localStorage.setItem("access_token", data.tokens.access_token);
        localStorage.setItem("refresh_token", data.tokens.refresh_token);

        return true;
      } catch (err) {
        throw (
          err.response?.data || {
            message: "Ro‘yxatdan o‘tishda xatolik yuz berdi.",
          }
        );
      }
    },

    async login(payload) {
      try {
        const { data } = await loginUser(payload);
        this.accessToken = data.tokens.access_token;

        localStorage.setItem("access_token", data.tokens.access_token);
        localStorage.setItem("refresh_token", data.tokens.refresh_token);

        return true;
      } catch (err) {
        throw {
          message:
            err.response?.data?.message ??
            "Tizimga kirishda xatolik yuz berdi.",
        };
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push("/login"); 
    },
  },
});
