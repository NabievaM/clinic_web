import api from "@/plugins/axios";

export const fetchBookings = () => api.get("/booking/all");

export const fetchBookingById = (id) => api.get(`/booking/${id}`);

export const createBooking = (payload) => api.post("/booking/create", payload);

export const updateBooking = (id, payload) =>
  api.put(`/booking/${id}`, payload);

export const deleteBooking = (id) => api.delete(`/booking/${id}`);

export const fetchBookingsForSpecialist = () =>
  api.get("/booking/specialist/bookings/all");

export const fetchBookingsForPatient = () =>
  api.get("/booking/patient/bookings/all");
