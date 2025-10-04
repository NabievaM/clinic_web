<template>
  <div
    v-if="bookingStore.loading"
    class="flex items-center gap-2 text-gray-500"
  >
    <svg
      class="animate-spin h-5 w-5 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    Yuklanmoqda...
  </div>

  <div
    v-if="bookingStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ bookingStore.error }}
  </div>

  <div
    v-if="!bookingStore.loading && bookingStore.bookings.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Foydalanuvchi</th>
          <th class="px-4 py-3 text-left">Xizmat</th>
          <th class="px-4 py-3 text-left">Mutaxassis</th>
          <th class="px-4 py-3 text-left">Qabul vaqti</th>
          <th class="px-4 py-3 text-left">Yaratilgan</th>
          <th class="px-4 py-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="b in [...bookingStore.bookings].sort((a, b) => a.id - b.id)"
          :key="b.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ b.id }}</td>
          <td class="px-4 py-3">{{ b.user?.full_name }}</td>
          <td class="px-4 py-3">{{ b.service?.name }}</td>
          <td class="px-4 py-3">{{ b.specialist?.user?.full_name }}</td>
          <td class="px-4 py-3 text-gray-500">
            {{ formatUTC(b.booking_datetime) }}
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ formatUTC(b.createdAt) }}
          </td>
          <td class="px-4 py-3">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                b.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : b.status === 'approved'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600',
              ]"
            >
              {{ b.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!bookingStore.loading && bookingStore.bookings.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Bronlar ro‘yxati</h2>
      <FileText class="w-5 h-7" />
    </div>

    <div
      v-for="b in [...bookingStore.bookings].sort((a, b) => a.id - b.id)"
      :key="b.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold text-gray-800">Bron #{{ b.id }}</h3>
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-semibold',
            b.status === 'pending'
              ? 'bg-yellow-100 text-yellow-600'
              : b.status === 'approved'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600',
          ]"
        >
          {{ b.status }}
        </span>
      </div>
      <p class="text-sm text-gray-600">👤 {{ b.user?.full_name }}</p>
      <p class="text-sm text-gray-600">💉{{ b.service?.name }}</p>
      <p class="text-sm text-gray-600">
        👨‍⚕️ {{ b.specialist?.user?.full_name }}
      </p>
      <p class="text-xs text-gray-500 mt-2">
        🗓 Qabul vaqti: {{ formatUTC(b.booking_datetime) }}
      </p>
      <p class="text-xs text-gray-400 mt-1">
        📌 Yaratilgan: {{ formatUTC(b.createdAt) }}
      </p>
    </div>
  </div>

  <div
    v-if="!bookingStore.loading && !bookingStore.bookings.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday booking topilmadi 🙅‍♂️
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useBookingStore } from "@/stores/booking";
import { FileText } from "lucide-vue-next";

const bookingStore = useBookingStore();

onMounted(() => {
  bookingStore.getBookings();
});

function formatUTC(dateStr) {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
</script>
