<template>
  <div class="flex justify-end mb-2">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Mutaxassisga xizmat qo‘shish</span>
    </button>
  </div>

  <div v-if="store.loading" class="flex items-center gap-2 text-gray-500">
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
    v-if="!store.loading && store.specialists.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200 table-auto text-center">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3">ID</th>
          <th class="px-4 py-3">Mutaxassis</th>
          <th class="px-4 py-3">Xizmat</th>
          <th class="px-4 py-3">Narx</th>
          <th class="px-4 py-3">Davomiylik</th>
          <th class="px-4 py-3 text-center">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="s in [...store.specialists].sort((a, b) => a.id - b.id)"
          :key="s.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ s.id }}</td>
          <td class="px-4 py-3 max-w-[200px]">
            <span class="block truncate" :title="s.specialist.user.full_name">{{
              s.specialist.user.full_name
            }}</span>
          </td>
          <td class="px-4 py-3 max-w-[200px]">
            <span class="block truncate" :title="s.service.name">
              {{ s.service.name }}</span
            >
          </td>
          <td class="px-4 py-3 text-gray-600">
            {{ formatPrice(s.service.price) }}
          </td>
          <td class="px-4 py-3 text-gray-600">
            {{ s.service.duration }} daqiqa
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-center gap-3 items-center">
              <router-link
                :to="{
                  name: 'AdminSpecialistServiceDetail',
                  params: { id: s.id },
                }"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Batafsil
              </router-link>

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
    v-if="!store.loading && store.specialists.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary mb-2 items-center">
      <Stethoscope class="w-5 h-5" />
      <h2 class="text-lg">Mutaxassis xizmatlari</h2>
    </div>

    <div
      v-for="s in [...store.specialists].sort((a, b) => a.id - b.id)"
      :key="s.id"
      class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="absolute top-3 right-3 flex gap-2">
        <button
          @click="openDeleteModal(s)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <h2
        class="text-base font-semibold text-primary mb-1 flex items-center gap-2"
      >
        <span
          class="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
        >
          ID: {{ s.id }}
        </span>
        {{ s.service.name }}
      </h2>

      <p class="text-sm text-gray-600 mb-2">
        💰 {{ formatPrice(s.service.price) }} — ⏱
        {{ s.service.duration }} daqiqa
      </p>

      <div class="flex items-center gap-3 mb-2">
        <img
          v-if="s.specialist.photo"
          :src="`http://localhost:3001/uploads/${s.specialist.photo}`"
          alt="photo"
          class="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-800">
            {{ s.specialist.user.full_name }}
          </h3>
          <p class="text-sm text-gray-600">{{ s.specialist.position }}</p>
        </div>
      </div>

      <router-link
        :to="{ name: 'AdminSpecialistServiceDetail', params: { id: s.id } }"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <div
    v-if="!store.loading && !store.specialists.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday mutaxassis topilmadi 🙅‍♂️
  </div>

  <SpecialistServiceForm
    v-model="showModal"
    :form="form"
    :error="formError"
    @submit="submitForm"
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
import { onMounted, ref } from "vue";
import { useSpecialistServiceStore } from "@/stores/specialistService";
import { Plus, Trash2, Stethoscope } from "lucide-vue-next";
import SpecialistServiceForm from "@/components/admin/SpecialistServiceForm.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";

const store = useSpecialistServiceStore();
const showModal = ref(false);
const showDelete = ref(false);
const deleteData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");
const form = ref({ specialist_id: "", service_id: "" });
const formError = ref("");

onMounted(() => {
  store.getAllSpecialists();
});

function formatPrice(price) {
  if (!price) return "0 so‘m";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}

function openDeleteModal(item) {
  deleteData.value = item;
  deleteTitle.value = "Xizmatni o‘chirish";
  deleteMessage.value = `${item.specialist.user.full_name}ning "${item.service.name}" xizmatini rostan ham o‘chirmoqchimisiz?`;
  showDelete.value = true;
}

async function confirmDelete() {
  if (deleteData.value) {
    await store.deleteMapping(deleteData.value.id);
    showDelete.value = false;
  }
}

function cancelDelete() {
  showDelete.value = false;
}

async function submitForm(data) {
  formError.value = "";
  if (data._validationError) {
    formError.value = data._validationError;
    return;
  }
  const success = await store.createMapping({
    specialist_id: Number(data.specialist_id),
    service_id: Number(data.service_id),
  });
  if (success) {
    showModal.value = false;
    form.value = { specialist_id: "", service_id: "" };
  } else {
    formError.value = store.error;
  }
}
</script>
