import { defineStore } from "pinia";
import {
  fetchSocialAccounts,
  fetchSocialAccountById,
  createSocialAccount,
  updateSocialAccount,
  deleteSocialAccount,
} from "@/api/social-account";

export const useSocialAccountStore = defineStore("socialAccount", {
  state: () => ({
    accounts: [],
    account: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getSocialAccounts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchSocialAccounts();
        this.accounts = res.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async getSocialAccountById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchSocialAccountById(id);
        this.account = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async addSocialAccount(data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await createSocialAccount(data);
        this.accounts.unshift(res.data);
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    async editSocialAccount(id, data) {
      this.loading = true;
      this.error = null;
      try {
        const res = await updateSocialAccount(id, data);
        const index = this.accounts.findIndex((a) => a.id === id);
        if (index !== -1) this.accounts[index] = res.data;
        return { success: true, data: res.data };
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
    async removeSocialAccount(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteSocialAccount(id);
        this.accounts = this.accounts.filter((a) => a.id !== id);
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});
