import { defineStore } from "pinia";
import { fetchSocialAccounts } from "@/api/social-account";

export const useSocialAccountStore = defineStore("socialAccount", {
  state: () => ({
    accounts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getSocialAccounts() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchSocialAccounts();
        this.accounts = data;
      } catch (err) {
        this.error = err.message || "Nimadir xato ketdi";
      } finally {
        this.loading = false;
      }
    },
  },
});
