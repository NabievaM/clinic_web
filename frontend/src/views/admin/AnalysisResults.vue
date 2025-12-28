<template>
  <div class="flex justify-end mb-4">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Analiz natija qo‘shish</span>
    </button>
  </div>

  <div
    v-if="analysisStore.loading"
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
    v-if="!analysisStore.loading && analysisStore.results.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200 text-center">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="th">ID</th>
          <th class="th">Bron raqami</th>
          <th class="th">Izoh</th>
          <th class="th">Qo‘shilgan sana</th>
          <th class="th">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="r in paginatedResults"
          :key="r.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="th font-medium text-gray-700">{{ r.id }}</td>
          <td class="th">{{ r.booking_id }}</td>
          <td class="th max-w-[200px]">
            <span class="block truncate" :title="r.description">
              {{ r.description }}
            </span>
          </td>
          <td class="th text-gray-500">
            {{ new Date(r.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="th">
            <div class="flex items-center justify-center gap-3">
              <router-link
                :to="`/admin/analysis-result/${r.id}`"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Batafsil
              </router-link>

              <button
                @click="openEditModal(r)"
                class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
              >
                <Edit2 class="w-4 h-4" />
              </button>

              <button
                @click="openDeleteModal(r)"
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
    v-if="!analysisStore.loading && analysisStore.results.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Analiz natijalari</h2>
      <TestTube2 class="w-5 h-7" />
    </div>

    <div
      v-for="r in paginatedResults"
      :key="r.id"
      class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="absolute top-3 right-3 flex gap-2">
        <button
          @click="openEditModal(r)"
          class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600"
        >
          <Edit2 class="w-4 h-4" />
        </button>

        <button
          @click="openDeleteModal(r)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <p class="text-sm font-semibold text-gray-800 flex items-center gap-1">
        <FileText class="w-4 h-4 text-blue-500" />
        <span class="break-all max-w-[200px]">{{ r.description }}</span>
      </p>
      <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <Calendar class="w-4 h-4 text-gray-500" />
        {{ new Date(r.createdAt).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/analysis-result/${r.id}`"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <Pagination
    v-if="analysisStore.results.length > limit"
    :total="analysisStore.results.length"
    :page="page"
    :limit="limit"
    @update:page="page = $event"
  />

  <div
    v-if="!analysisStore.loading && !analysisStore.results.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday tahlil natijasi topilmadi 🙅‍♂️
  </div>

  <AnalysisResultForm v-model="showModal" :form="form" @submit="submitForm" />

  <EditModal
    :visible="showEdit"
    title="Natijani tahrirlash"
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
import { ref, onMounted, computed, watch } from "vue";
import { useAnalysisResultStore } from "@/stores/analysisResult";
import {
  Plus,
  TestTube2,
  Trash2,
  Edit2,
  FileText,
  Calendar,
} from "lucide-vue-next";
import AnalysisResultForm from "@/components/admin/AnalysisResultForm.vue";
import EditModal from "@/components/admin/common/EditModal.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const analysisStore = useAnalysisResultStore();
const showModal = ref(false);
const showDelete = ref(false);
const showEdit = ref(false);

const deleteData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");

const editData = ref({});
const editError = ref("");

const editFields = [
  { label: "Bron raqami", model: "booking_id", type: "text" },
  { label: "Izoh", model: "description", type: "text" },
];

const form = ref({
  booking_id: "",
  file_url: "",
  description: "",
});

const page = ref(1);
const limit = ref(10);

onMounted(() => {
  analysisStore.getResults();
});

watch(
  () => analysisStore.results.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

const paginatedResults = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...analysisStore.results]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

async function submitForm(data, setError) {
  try {
    await analysisStore.addResult(data);
    showModal.value = false;
    form.value = { booking_id: "", file_url: "", description: "" };
    await analysisStore.getResults();
  } catch (error) {
    if (typeof setError === "function") {
      setError(error.message);
    }
  }
}

function openEditModal(r) {
  editData.value = { ...r };
  showEdit.value = true;
}

async function confirmEdit(updated) {
  editError.value = "";
  try {
    await analysisStore.updateResult(updated.id, updated);
    showEdit.value = false;
    await analysisStore.getResults();
  } catch (e) {
    editError.value = e.message || "Xatolik yuz berdi";
  }
}

function cancelEdit() {
  showEdit.value = false;
}

function openDeleteModal(result) {
  deleteData.value = result;
  deleteTitle.value = "Tahlil natijasini o‘chirish";
  deleteMessage.value = `#${result.id} natijani rostan ham o‘chirmoqchimisiz?`;
  showDelete.value = true;
}

async function confirmDelete() {
  await analysisStore.deleteResult(deleteData.value.id);
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
