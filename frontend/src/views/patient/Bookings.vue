<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-6 py-4">
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

      <div v-if="bookingStore.error" class="text-red-500 py-2">
        ❌ {{ bookingStore.error }}
      </div>

      <div
        v-if="!bookingStore.loading && bookingStore.bookings.length"
        class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200 text-center">
          <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
            <tr>
              <th class="th">ID</th>
              <th class="th">Mutaxassis</th>
              <th class="th">Xizmat</th>
              <th class="th">Qabul vaqti</th>
              <th class="th">Yaratilgan</th>
              <th class="th">Status</th>
              <th class="th">Amallar</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="b in paginatedBookings"
              :key="b.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="th font-medium text-gray-700">{{ b.id }}</td>
              <td class="th max-w-[200px]">
                <span
                  class="block truncate"
                  :title="b.specialist?.user?.full_name"
                  >{{ b.specialist?.user?.full_name }}</span
                >
              </td>
              <td class="th max-w-[200px]">
                <span class="block truncate" :title="b.service?.name">{{
                  b.service?.name
                }}</span>
              </td>
              <td class="th text-gray-500">
                {{ formatUTC(b.booking_datetime) }}
              </td>
              <td class="th">{{ formatUZT(b.createdAt) }}</td>
              <td class="th">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    b.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : b.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-600'
                      : b.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600',
                  ]"
                  >{{ getStatusLabel(b.status) }}</span
                >
              </td>
              <td class="th">
                <button
                  v-if="b.status === 'pending'"
                  @click="openCancelModal(b)"
                  class="px-3 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Bekor qilish
                </button>
                <span v-else class="text-gray-400 text-xs">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!bookingStore.loading && bookingStore.bookings.length"
        class="space-y-4 md:hidden"
      >
        <div class="flex gap-2 font-bold text-primary items-center">
          <FileText class="w-5 h-5" />
          <h2 class="text-lg">Bronlarim</h2>
        </div>

        <div
          v-for="b in paginatedBookings"
          :key="b.id"
          class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div class="flex gap-2 items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-800">
              Bron #{{ b.id }}
            </h3>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                b.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : b.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-600'
                  : b.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600',
              ]"
              >{{ getStatusLabel(b.status) }}</span
            >
          </div>
          <p class="text-sm text-gray-600 flex items-center gap-1">
            <User class="w-4 h-4 text-purple-600" />
            {{ b.specialist?.user?.full_name }}
          </p>
          <p class="text-sm text-gray-600 flex items-center gap-1">
            <Stethoscope class="w-4 h-4 text-yellow-300" />
            <span class="break-all max-w-[200px]">{{ b.service?.name }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Calendar class="w-4 h-4 text-blue-500" /> Qabul vaqti:
            {{ formatUTC(b.booking_datetime) }}
          </p>
          <p class="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Calendar class="w-4 h-4 text-gray-400" /> Yaratilgan:
            {{ formatUZT(b.createdAt) }}
          </p>
          <button
            v-if="b.status === 'pending'"
            @click="openCancelModal(b)"
            class="mt-3 w-full text-sm py-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
          >
            Bekor qilish
          </button>
        </div>
      </div>

      <div
        v-else-if="!bookingStore.loading && !bookingStore.bookings.length"
        class="my-10 flex flex-col items-center justify-center text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
        >
          <svg
            class="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mb-1">
          Sizda hali bronlar yo‘q
        </h3>

        <p class="text-sm text-gray-500 max-w-sm mb-5">
          Mutaxassis tanlab, qulay vaqtda qabulga yozilishingiz mumkin
        </p>

        <router-link
          to="/services"
          class="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium shadow hover:shadow-lg hover:bg-primary/90 transition"
        >
          Qabulga yozilish
        </router-link>
      </div>

      <Pagination
        v-if="bookingStore.bookings.length > limit"
        :total="bookingStore.bookings.length"
        :page="page"
        :limit="limit"
        @update:page="page = $event"
      />

      <div
        v-if="showCancel"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="closeCancel"
      >
        <div
          class="bg-white w-full max-w-md mx-4 rounded-xl shadow-lg p-6 relative"
        >
          <button
            @click="closeCancel"
            class="absolute top-2 right-3 text-2xl text-gray-500 hover:text-red-700"
          >
            &times;
          </button>
          <h2 class="text-lg text-center font-semibold text-gray-800 mb-4">
            Bronni bekor qilish
          </h2>
          <p class="text-gray-600 mb-4 text-center">
            Siz haqiqatan ham bronni bekor qilmoqchimisiz?
          </p>
          <p v-if="cancelError" class="text-red-500 mb-4">{{ cancelError }}</p>
          <div class="flex justify-center gap-3">
            <button
              @click="closeCancel"
              class="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
            >
              Yo'q
            </button>
            <button
              @click="confirmCancel"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Ha
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { useBookingStore } from "@/stores/booking";
import Pagination from "@/components/common/Pagination.vue";
import { FileText, User, Calendar, Stethoscope } from "lucide-vue-next";

const bookingStore = useBookingStore();

const page = ref(1);
const limit = ref(10);

const showCancel = ref(false);
const cancelBookingId = ref(null);
const cancelError = ref("");

const statusLabels = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};

onMounted(() => bookingStore.getBookingsForPatient());

const paginatedBookings = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...bookingStore.bookings]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

watch(
  () => bookingStore.bookings.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

function getStatusLabel(status) {
  return statusLabels[status] || status;
}

function formatUTC(dateStr) {
  const d = new Date(dateStr);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getUTCDate()).padStart(2, "0")} ${String(
    d.getUTCHours()
  ).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function formatUZT(dateStr) {
  const d = new Date(dateStr);
  d.setHours(d.getUTCHours() + 5);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function openCancelModal(b) {
  cancelBookingId.value = b.id;
  cancelError.value = "";
  showCancel.value = true;
}

async function confirmCancel() {
  cancelError.value = "";
  try {
    await bookingStore.editBooking(cancelBookingId.value, {
      status: "cancelled",
    });
    showCancel.value = false;
    await bookingStore.getBookingsForPatient();
  } catch (e) {
    cancelError.value = e.message || "Xatolik yuz berdi";
  }
}

function closeCancel() {
  showCancel.value = false;
}
</script>
