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
      />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
    v-if="!bookingStore.loading && paginatedBookings.length"
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
          <th class="px-4 py-3 text-right">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="b in paginatedBookings"
          :key="b.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ b.id }}</td>
          <td class="px-4 py-3 max-w-[150px]">
            <span class="block truncate" :title="b.user?.full_name">{{
              b.user?.full_name
            }}</span>
          </td>
          <td class="px-4 py-3 max-w-[150px]">
            <span class="block truncate" :title="b.service?.name">{{
              b.service?.name
            }}</span>
          </td>
          <td class="px-4 py-3 max-w-[150px]">
            <span class="block truncate" :title="b.specialist?.user?.full_name">
              {{ b.specialist?.user?.full_name }}
            </span>
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ formatUTC(b.booking_datetime) }}
          </td>
          <td class="px-4 py-3 text-gray-500">{{ formatUTC(b.createdAt) }}</td>
          <td class="px-4 py-3">
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
              {{ b.status }}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            <div class="flex justify-end gap-2">
              <button
                @click="openEditModal(b)"
                class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
              >
                <Edit2 class="w-4 h-4" />
              </button>

              <button
                @click="openDeleteModal(b)"
                class="flex items-center justify-center w-7 h-7 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!bookingStore.loading && paginatedBookings.length"
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
      <div class="absolute top-3 right-3 flex gap-2">
        <button
          @click="openEditModal(b)"
          class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500"
        >
          <Edit2 class="w-4 h-4" />
        </button>

        <button
          @click="openDeleteModal(b)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <div class="flex gap-2 items-center mb-2 pr-10">
        <h3 class="text-lg font-semibold text-gray-800">Bron #{{ b.id }}</h3>
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
          {{ b.status }}
        </span>
      </div>

      <p class="text-sm text-gray-600">👤 {{ b.user?.full_name }}</p>
      <p class="text-sm text-gray-600">💉 {{ b.service?.name }}</p>
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

  <Pagination
    v-if="bookingStore.bookings.length > limit"
    :total="bookingStore.bookings.length"
    :page="page"
    :limit="limit"
    @update:page="page = $event"
  />

  <div
    v-if="!bookingStore.loading && !bookingStore.bookings.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday booking topilmadi 🙅‍♂️
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

  <DeleteModal
    :visible="showDelete"
    :title="deleteTitle"
    :message="deleteMessage"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useBookingStore } from "@/stores/booking";
import { FileText, Trash2, Edit2 } from "lucide-vue-next";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import EditModal from "@/components/admin/common/EditModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const bookingStore = useBookingStore();
const showDelete = ref(false);
const showEdit = ref(false);
const deleteData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");

const editData = ref({});
const editError = ref("");
const dropdownOpen = ref(false);

const page = ref(1);
const limit = ref(8);

const statuses = [
  { value: "pending", label: "Kutilmoqda" },
  { value: "confirmed", label: "Tasdiqlangan" },
  { value: "completed", label: "Yakunlangan" },
  { value: "cancelled", label: "Bekor qilingan" },
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

onMounted(() => {
  bookingStore.getBookings();
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

function formatUTC(dateStr) {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function openDeleteModal(b) {
  deleteData.value = b;
  deleteTitle.value = "Bronni o‘chirish";
  deleteMessage.value = `${b.user?.full_name || "Foydalanuvchi"}ning "${
    b.service?.name || "Xizmat"
  }" bronini rostan ham o‘chirmoqchimisiz?`;
  showDelete.value = true;
}

async function confirmDelete() {
  if (deleteData.value) {
    await bookingStore.removeBooking(deleteData.value.id);
    showDelete.value = false;
  }
}

function cancelDelete() {
  showDelete.value = false;
}

function openEditModal(b) {
  editData.value = { ...b };
  showEdit.value = true;
}

async function confirmEdit(updated) {
  editError.value = "";
  try {
    await bookingStore.editBooking(updated.id, updated);
    showEdit.value = false;
    await bookingStore.getBookings();
  } catch (e) {
    editError.value = e.message || "Xatolik yuz berdi";
  }
}

function cancelEdit() {
  showEdit.value = false;
}
</script>
