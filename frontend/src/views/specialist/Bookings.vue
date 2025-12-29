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

      <!-- Desktop Table -->
      <div
        v-if="!bookingStore.loading && bookingStore.bookings.length"
        class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200 text-center">
          <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
            <tr>
              <th class="th">ID</th>
              <th class="th">Foydalanuvchi</th>
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
                <span class="block truncate" :title="b.user?.full_name">{{
                  b.user?.full_name
                }}</span>
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
                >
                  {{ getStatusLabel(b.status) }}
                </span>
              </td>
              <td class="th text-right">
                <div class="flex justify-center">
                  <button
                    v-if="b.status !== 'cancelled'"
                    @click="openEditModal(b)"
                    class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div
        v-if="!bookingStore.loading && bookingStore.bookings.length"
        class="space-y-4 md:hidden"
      >
        <div class="flex gap-2 font-bold text-primary items-center">
          <FileText class="w-5 h-5" />
          <h2 class="text-lg">Bronlar ro‘yxati</h2>
        </div>

        <div
          v-for="b in paginatedBookings"
          :key="b.id"
          class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div class="absolute top-3 right-3">
            <button
              v-if="b.status !== 'cancelled'"
              @click="openEditModal(b)"
              class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500"
            >
              <Edit2 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex gap-2 items-center mb-2 pr-10">
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
            >
              {{ getStatusLabel(b.status) }}
            </span>
          </div>

          <p class="text-sm text-gray-600 flex items-center gap-1">
            <User class="w-4 h-4 text-purple-600" /> {{ b.user?.full_name }}
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
        </div>
      </div>

      <Pagination
        v-if="bookingStore.bookings.length > limit"
        :total="bookingStore.bookings.length"
        :page="page"
        :limit="limit"
        @update:page="page = $event"
      />

      <div
        v-else-if="!bookingStore.loading && !bookingStore.bookings.length"
        class="text-gray-500 mt-4 text-center"
      >
        Hech qanday bron topilmadi 🙅‍♂️
      </div>
    </div>

    <EditModal
      :visible="showEdit"
      title="Bronni tahrirlash"
      :formData="editData"
      :fields="editFields"
      :error="editError"
      @save="confirmEdit"
      @cancel="cancelEdit"
    />
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useBookingStore } from "@/stores/booking";
import AppLayout from "@/layouts/AppLayout.vue";
import { FileText, Edit2, User, Calendar, Stethoscope } from "lucide-vue-next";
import EditModal from "@/components/admin/common/EditModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const bookingStore = useBookingStore();

const showEdit = ref(false);
const editData = ref({});
const editError = ref("");

const page = ref(1);
const limit = ref(10);

const statuses = [
  { value: "pending", label: "Kutilmoqda" },
  { value: "confirmed", label: "Tasdiqlangan" },
  { value: "completed", label: "Yakunlangan" },
];

const editFields = [
  {
    label: "Status",
    model: "status",
    type: "select",
    options: statuses,
    colSpan: 2,
  },
];

const statusLabels = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};

onMounted(() => {
  bookingStore.getBookingsForSpecialist();
});

watch(
  () => bookingStore.bookings.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

const paginatedBookings = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...bookingStore.bookings]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

function getStatusLabel(status) {
  return statusLabels[status] || status;
}

function formatUTC(dateStr) {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
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

function openEditModal(b) {
  if (b.status === "cancelled") return;
  editData.value = { ...b };
  editError.value = "";
  showEdit.value = true;
}

async function confirmEdit(updated) {
  editError.value = "";
  try {
    await bookingStore.editBooking(updated.id, updated);
    showEdit.value = false;
    await bookingStore.getBookingsForSpecialist();
  } catch (e) {
    editError.value = e.message || "Xatolik yuz berdi";
  }
}

function cancelEdit() {
  showEdit.value = false;
}
</script>
