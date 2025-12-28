<template>
  <div class="flex justify-end mb-4">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Mutaxassis qo‘shish</span>
    </button>
  </div>

  <div
    v-if="specialistStore.loading"
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
    v-if="!specialistStore.loading && paginatedSpecialists.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200 table-auto text-center">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="th">ID</th>
          <th class="th">Ism</th>
          <th class="th">Lavozim</th>
          <th class="th">Tajriba</th>
          <th class="th">Qo‘shilgan sana</th>
          <th class="th">Amallar</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100 text-center">
        <tr
          v-for="s in paginatedSpecialists"
          :key="s.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="th font-medium text-gray-700">{{ s.id }}</td>
          <td class="th max-w-[200px]">
            <span class="block truncate" :title="s.user.full_name">{{
              s.user.full_name
            }}</span>
          </td>
          <td class="th max-w-[200px]">
            <span class="block truncate" :title="s.position">{{
              s.position
            }}</span>
          </td>
          <td class="th">{{ s.experience_years }}</td>
          <td class="th text-gray-500">
            {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="th">
            <div class="flex items-center justify-center gap-3">
              <router-link
                :to="`/admin/specialist/${s.id}`"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Batafsil
              </router-link>
              <button
                @click="openEditModal(s)"
                class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button
                @click="openDeleteModal(s)"
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
    v-if="!specialistStore.loading && paginatedSpecialists.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary mb-4 items-center">
      <Users class="w-5 h-5" />
      <h2 class="text-lg">Mutaxassislar ro‘yxati</h2>
    </div>

    <div
      v-for="s in paginatedSpecialists"
      :key="s.id"
      class="relative bg-white p-4 rounded-xl shadow border border-gray-200"
    >
      <div class="absolute top-3 right-3 flex flex-row items-center gap-2">
        <button
          @click="openEditModal(s)"
          class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="openDeleteModal(s)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <div class="pr-12">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ s.user.full_name }}
        </h3>

        <div class="flex items-center gap-2 mt-1">
          <span
            class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
          >
            ID: {{ s.id }}
          </span>
          <span
            class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold"
          >
            {{ s.position || "—" }}
          </span>
        </div>

        <p class="text-sm text-gray-600 mt-2 flex items-center gap-1">
          <BriefcaseMedical class="w-4 h-4 text-blue-500" /> Tajriba:
          {{ s.experience_years || "—" }}
        </p>
        <p class="text-sm text-gray-600 flex items-center gap-1">
          <Stethoscope class="w-4 h-4 text-yellow-500" /> Ixtisosligi:
          {{ s.specialization || "—" }}
        </p>
        <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Calendar class="w-4 h-4 text-gray-500" />
          {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
        </p>

        <router-link
          :to="`/admin/specialist/${s.id}`"
          class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Batafsil
        </router-link>
      </div>
    </div>
  </div>

  <Pagination
    v-if="specialistStore.specialists.length > limit"
    :total="specialistStore.specialists.length"
    :page="page"
    :limit="limit"
    @update:page="page = $event"
  />

  <div
    v-if="!specialistStore.loading && !specialistStore.specialists.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday mutaxassis topilmadi 🙅‍♂️
  </div>

  <SpecialistForm v-model="showModal" :form="form" @submit="submitForm" />

  <EditModal
    :visible="showEdit"
    title="Mutaxassisni tahrirlash"
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
import { ref, computed, onMounted, watch } from "vue";
import { useSpecialistStore } from "@/stores/specialist";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  BriefcaseMedical,
  Stethoscope,
  Calendar,
  User,
} from "lucide-vue-next";
import SpecialistForm from "@/components/admin/SpecialistForm.vue";
import EditModal from "@/components/admin/common/EditModal.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import Pagination from "@/components/common/Pagination.vue";
import { updateSpecialist } from "@/api/specialist";

const specialistStore = useSpecialistStore();

const showModal = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);

const deleteSpecialistData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");
const editData = ref({});
const editError = ref("");

const page = ref(1);
const limit = ref(10);

onMounted(() => {
  specialistStore.getSpecialists();
});

watch(
  () => specialistStore.specialists.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

const paginatedSpecialists = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...specialistStore.specialists]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

const form = ref({
  user_id: "",
  photo: "",
  position: "",
  experience_years: "",
  specialization: "",
  working_days: "",
  status: "active",
  description: "",
});

const editFields = [
  {
    label: "Lavozimi",
    model: "position",
    type: "text",
    placeholder: "Masalan: Terapevt",
  },
  {
    label: "Ixtisosligi",
    model: "specialization",
    type: "text",
    placeholder: "Masalan: Kardiologiya",
  },
  {
    label: "Ish tajribasi",
    model: "experience_years",
    type: "text",
    placeholder: "Masalan: 5 yil",
  },
  {
    label: "Status",
    model: "status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    label: "Ish kunlari",
    model: "working_days",
    type: "textarea",
    placeholder: "Dushanba 10:00-20:00",
    colSpan: 2,
  },
  {
    label: "Tavsif",
    model: "description",
    type: "textarea",
    placeholder: "Qisqacha izoh...",
    colSpan: 2,
  },
];

async function submitForm(data, setError) {
  try {
    await specialistStore.add(data);
    showModal.value = false;
    resetForm();
    await specialistStore.getSpecialists();
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Noma'lum xato yuz berdi";
    if (typeof setError === "function") setError(message);
  }
}

function resetForm() {
  form.value = {
    user_id: "",
    photo: "",
    position: "",
    experience_years: "",
    specialization: "",
    working_days: "",
    status: "active",
    description: "",
  };
}

function openEditModal(s) {
  editData.value = { ...s };
  showEdit.value = true;
}

async function confirmEdit(updated) {
  editError.value = "";
  try {
    await updateSpecialist(updated.id, updated);
    showEdit.value = false;
    await specialistStore.getSpecialists();
  } catch (e) {
    editError.value = e.response?.data?.message || "Xatolik yuz berdi";
  }
}

function cancelEdit() {
  showEdit.value = false;
}

function openDeleteModal(s) {
  deleteSpecialistData.value = s;
  deleteTitle.value = "Mutaxassisni o‘chirish";
  deleteMessage.value = `${s.user.full_name} mutaxassisini rostan ham o‘chirmoqchimisiz?`;
  showDelete.value = true;
}

async function confirmDelete() {
  await specialistStore.remove(deleteSpecialistData.value.id);
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
