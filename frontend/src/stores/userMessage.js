import { defineStore } from "pinia";
import {
  sendUserMessage,
  fetchUserMessages,
  fetchUserMessageById,
  deleteUserMessage,
} from "@/api/user-message";

export const useUserMessageStore = defineStore("userMessage", {
  state: () => ({
    messages: [],
    message: null,
    loading: false,
    error: null,
  }),

  actions: {
    async sendMessage(data) {
      this.loading = true;
      this.error = null;
      try {
        const { data: res } = await sendUserMessage(data);
        return res;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Xabar yuborishda xatolik";
        this.error = msg;
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async getMessages() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchUserMessages();
        this.messages = data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Xabarlarni olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async getMessage(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchUserMessageById(id);
        this.message = data;
        return data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Xabarni olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async removeMessage(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteUserMessage(id);
        this.messages = this.messages.filter((m) => m.id !== id);
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Xabarni o‘chirishda xatolik";
      } finally {
        this.loading = false;
      }
    },
  },
});
