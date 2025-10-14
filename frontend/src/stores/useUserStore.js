import { defineStore } from "pinia";
import {
  fetchMe,
  updateUser,
  fetchAll,
  deleteUser,
  searchUsers,
  getUserById,
} from "@/api/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    users: [],
    selectedUser: null,
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
          err.response?.data?.message || "Foydalanuvchini olishda xato";
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
        this.error = err.response?.data?.message || "Userlarni olishda xato";
      } finally {
        this.loading = false;
      }
    },

    async searchUser(keyword) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await searchUsers(keyword);
        this.users = data;
      } catch (err) {
        this.error = err.response?.data?.message || "Qidiruvda xato";
      } finally {
        this.loading = false;
      }
    },

    async getUserById(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await getUserById(id);
        this.selectedUser = data;
      } catch (err) {
        this.error = err.response?.data?.message || "Userni olishda xato";
      } finally {
        this.loading = false;
      }
    },

    async updateMyProfile(payload) {
      if (!this.user?.id)
        return { ok: false, message: "Foydalanuvchi aniqlanmadi" };
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

    async updateUserById(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await updateUser(id, payload);
        await this.getAllUsers();
        return { ok: true, message: data.message };
      } catch (err) {
        const msg = err.response?.data?.message || "Yangilashda xato";
        this.error = msg;
        return { ok: false, message: msg };
      } finally {
        this.loading = false;
      }
    },

    async deleteUserById(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteUser(id);
        await this.getAllUsers();
        return { ok: true, message: "Foydalanuvchi muvaffaqiyatli o‘chirildi" };
      } catch (err) {
        const msg = err.response?.data?.message || "O‘chirishda xato";
        this.error = msg;
        return { ok: false, message: msg };
      } finally {
        this.loading = false;
      }
    },
  },
});
