import { defineStore } from "pinia";
import {
  fetchBookings,
  fetchBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  fetchBookingsForSpecialist,
  fetchBookingsForPatient,
} from "@/api/booking";

export const useBookingStore = defineStore("booking", {
  state: () => ({
    bookings: [],
    booking: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getBookings() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchBookings();
        this.bookings = data;
      } catch (err) {
        this.error = err.message || "Bookinglarni olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async getBookingsForSpecialist() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchBookingsForSpecialist();
        this.bookings = data;
      } catch (err) {
        this.error = err.message || "Mutaxassis bookinglarini olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async getBookingsForPatient() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchBookingsForPatient();
        this.bookings = data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          "Bemor bookinglarini olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async getBooking(id) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await fetchBookingById(id);
        this.booking = data;
      } catch (err) {
        this.error = err.message || "Bookingni olishda xatolik";
      } finally {
        this.loading = false;
      }
    },

    async addBooking(payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await createBooking(payload);
        this.bookings.push(data);
        return data;
      } catch (err) {
        this.error = err.message || "Booking yaratishda xatolik";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async editBooking(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await updateBooking(id, payload);
        const index = this.bookings.findIndex((b) => b.id === id);
        if (index !== -1) this.bookings[index] = data;
        return data;
      } catch (err) {
        this.error = err.message || "Bookingni yangilashda xatolik";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async removeBooking(id) {
      this.loading = true;
      this.error = null;
      try {
        await deleteBooking(id);
        this.bookings = this.bookings.filter((b) => b.id !== id);
      } catch (err) {
        this.error = err.message || "Bookingni o‘chirishda xatolik";
      } finally {
        this.loading = false;
      }
    },
  },
});
