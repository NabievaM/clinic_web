<template>
  <div class="flex justify-end mb-2">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" /> <span>Mutaxassisga xizmat qo‘shish</span>
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
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Mutaxassis</th>
          <th class="px-4 py-3 text-left">Xizmat</th>
          <th class="px-4 py-3 text-left">Narx</th>
          <th class="px-4 py-3 text-left">Davomiylik</th>
          <th class="px-4 py-3 text-left">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="s in [...store.specialists].sort((a, b) => a.id - b.id)"
          :key="s.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ s.id }}</td>
          <td class="px-4 py-3">{{ s.specialist.user.full_name }}</td>
          <td class="px-4 py-3">{{ s.service.name }}</td>
          <td class="px-4 py-3 text-gray-600">
            {{ formatPrice(s.service.price) }}
          </td>
          <td class="px-4 py-3 text-gray-600">
            {{ s.service.duration }} daqiqa
          </td>
          <td class="px-4 py-3">
            <router-link
              :to="{
                name: 'AdminSpecialistServiceDetail',
                params: { id: s.id },
              }"
              class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Batafsil
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    v-if="!store.loading && store.specialists.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Mutaxassis xizmatlari</h2>
      <Stethoscope class="w-5 h-7" />
    </div>
    <div
      v-for="s in [...store.specialists].sort((a, b) => a.id - b.id)"
      :key="s.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <h2 class="text-base font-semibold text-primary mb-1">
        🛠 {{ s.service.name }}
      </h2>
      <p class="text-sm text-gray-600 mb-2">
        💰 {{ formatPrice(s.service.price) }} — ⏱
        {{ s.service.duration }} daqiqa
      </p>
      <div class="flex items-center gap-3 mb-2">
        <img
          v-if="s.specialist.photo"
          :src="`http://localhost:3000/uploads/${s.specialist.photo}`"
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
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useSpecialistServiceStore } from "@/stores/specialistService";
import { Plus } from "lucide-vue-next";
import { Stethoscope } from "lucide-vue-next";
import SpecialistServiceForm from "@/components/admin/SpecialistServiceForm.vue";

const store = useSpecialistServiceStore();
const showModal = ref(false);
const form = ref({ specialist_id: "", service_id: "" });
const formError = ref("");

onMounted(() => {
  store.getAllSpecialists();
});

function formatPrice(price) {
  if (!price) return "0 so‘m";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
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
