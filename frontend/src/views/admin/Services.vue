<template>
  <div class="flex justify-end mb-2">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Xizmat qo‘shish</span>
    </button>
  </div>

  <div
    v-if="serviceStore.loading"
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
    v-if="!serviceStore.loading && paginatedServices.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="th text-left">ID</th>
          <th class="th text-left">Xizmat nomi</th>
          <th class="th text-left">Narxi</th>
          <th class="th text-left">Davomiyligi</th>
          <th class="th text-left">Tavsif</th>
          <th class="th text-left">Mashhur</th>
          <th class="th text-left">Qo‘shildi</th>
          <th class="th text-right">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="s in paginatedServices"
          :key="s.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="th font-medium text-gray-700">{{ s.id }}</td>
          <td class="th max-w-[200px]">
            <span class="block truncate" :title="s.name">{{ s.name }}</span>
          </td>
          <td class="th text-green-600 font-semibold">
            {{ formatPrice(s.price) }}
          </td>
          <td class="th">{{ s.duration }} daqiqa</td>
          <td class="th text-gray-600 max-w-[200px]">
            <span class="block truncate" :title="s.description">
              {{ s.description }}
            </span>
          </td>
          <td class="th">
            <span
              v-if="s.is_popular"
              class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full font-semibold"
            >
              ⭐ Ha
            </span>
            <span
              v-else
              class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full"
            >
              Yo‘q
            </span>
          </td>
          <td class="th text-gray-500">
            {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="th text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                @click="openEditModal(s)"
                class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button
                @click="openDeleteModal(s)"
                class="flex items-center justify-center w-7 h-7 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MOBILE -->
  <div
    v-if="!serviceStore.loading && paginatedServices.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary items-center">
      <h2 class="text-xl">Xizmatlar ro‘yxati</h2>
      <Stethoscope class="w-5 h-7" />
    </div>

    <div
      v-for="s in paginatedServices"
      :key="s.id"
      class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="absolute top-3 right-3 flex gap-2">
        <button
          @click="openEditModal(s)"
          class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="openDeleteModal(s)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <h3 class="text-lg font-semibold text-gray-800 pr-10">{{ s.name }}</h3>

      <div class="flex items-center gap-2 mt-1">
        <span
          class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
        >
          ID: {{ s.id }}
        </span>

        <span
          v-if="s.is_popular"
          class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded-full font-semibold"
        >
          ⭐ Mashhur
        </span>
      </div>

      <p class="text-sm text-gray-600 mt-2 flex items-center gap-1">
        <DollarSign class="w-4 h-4 text-green-500" /> {{ formatPrice(s.price) }}
      </p>
      <p class="text-sm text-gray-600 flex items-center gap-1">
        <Clock class="w-4 h-4 text-gray-500" /> {{ s.duration }} daqiqa
      </p>
      <p class="text-sm text-gray-600 flex items-center gap-1">
        <Stethoscope class="w-4 h-4 text-yellow-500" /> {{ s.description }}
      </p>
      <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
        <Calendar class="w-4 h-4 text-blue-500" />
        {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
      </p>
    </div>
  </div>

  <Pagination
    v-if="serviceStore.services.length > limit"
    :total="serviceStore.services.length"
    :page="page"
    :limit="limit"
    @update:page="page = $event"
  />

  <div
    v-if="!serviceStore.loading && !serviceStore.services.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday xizmat topilmadi 🙅‍♂️
  </div>

  <ServiceForm v-model="showModal" :form="form" @submit="submitForm" />

  <EditModal
    :visible="showEdit"
    title="Xizmatni tahrirlash"
    :formData="editServiceData"
    :fields="editFields"
    :error="editFormError"
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
import { ref, computed, onMounted, watch } from "vue";
import { useServiceStore } from "@/stores/service";
import {
  Stethoscope,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Clock,
  Calendar,
} from "lucide-vue-next";
import ServiceForm from "@/components/admin/ServiceForm.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import EditModal from "@/components/admin/common/EditModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const serviceStore = useServiceStore();

const page = ref(1);
const limit = ref(10);

const showModal = ref(false);
const showDelete = ref(false);
const showEdit = ref(false);

const deleteServiceData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");
const editServiceData = ref({});
const editFormError = ref("");

const form = ref({
  name: "",
  price: "",
  duration: "",
  description: "",
  is_popular: false,
});

const editFields = [
  {
    label: "Xizmat nomi",
    model: "name",
    type: "text",
    placeholder: "Masalan: Tish tozalash",
  },
  {
    label: "Narxi (so‘m)",
    model: "price",
    type: "number",
    placeholder: "100000",
  },
  {
    label: "Davomiyligi (daqiqalarda)",
    model: "duration",
    type: "number",
    placeholder: "30",
  },
  {
    label: "Mashhur",
    model: "is_popular",
    type: "select",
    options: [
      { value: true, label: "Ha" },
      { value: false, label: "Yo‘q" },
    ],
  },
  {
    label: "Tavsif",
    model: "description",
    type: "textarea",
    placeholder: "Xizmat haqida qisqacha ma’lumot...",
    colSpan: 2,
  },
];

onMounted(() => {
  serviceStore.fetchServices();
});

watch(
  () => serviceStore.services.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

const paginatedServices = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...serviceStore.services]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price || 0) + " so‘m";
}

async function submitForm(data) {
  const success = await serviceStore.addService(data);
  if (success) {
    showModal.value = false;
    form.value = {
      name: "",
      price: "",
      duration: "",
      description: "",
      is_popular: false,
    };
  }
}

function openEditModal(service) {
  editServiceData.value = { ...service };
  showEdit.value = true;
}

async function confirmEdit(updatedService) {
  editFormError.value = "";

  if (typeof updatedService.is_popular === "string") {
    updatedService.is_popular = updatedService.is_popular === "true";
  }

  const { ok, message } = await serviceStore.editService(
    updatedService.id,
    updatedService
  );

  if (!ok) {
    editFormError.value = message;
  } else {
    showEdit.value = false;
    await serviceStore.fetchServices();
  }
}

function cancelEdit() {
  showEdit.value = false;
}

function openDeleteModal(service) {
  deleteServiceData.value = service;
  deleteTitle.value = "Xizmatni o‘chirish";
  deleteMessage.value = `${service.name} xizmatini rostan ham o‘chirilsinmi?`;
  showDelete.value = true;
}

async function confirmDelete() {
  const success = await serviceStore.removeService(deleteServiceData.value.id);
  if (success) {
    await serviceStore.fetchServices();
  }
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
