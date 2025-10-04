<template>
  <div class="flex justify-end mb-2">
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
    v-if="!specialistStore.loading && specialistStore.specialists.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Ism</th>
          <th class="px-4 py-3 text-left">Lavozim</th>
          <th class="px-4 py-3 text-left">Tajriba</th>
          <th class="px-4 py-3 text-left">Qo‘shilgan sana</th>
          <th class="px-4 py-3 text-left">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="s in specialistStore.specialists"
          :key="s.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ s.id }}</td>
          <td class="px-4 py-3">{{ s.user.full_name }}</td>
          <td class="px-4 py-3">{{ s.position }}</td>
          <td class="px-4 py-3">{{ s.experience_years }}</td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3">
            <router-link
              :to="`/admin/specialist/${s.id}`"
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
    v-if="!specialistStore.loading && specialistStore.specialists.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Mutaxassislar</h2>
      <Users class="w-5 h-7" />
    </div>

    <div
      v-for="s in specialistStore.specialists"
      :key="s.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <p class="text-sm font-semibold text-gray-800">
        👨‍⚕️ {{ s.user.full_name }}
      </p>
      <p class="text-xs text-gray-500">
        {{ s.position }} • {{ s.experience_years }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        🗓 {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/specialist/${s.id}`"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <div
    v-if="!specialistStore.loading && !specialistStore.specialists.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday mutaxassis topilmadi 🙅‍♂️
  </div>

  <SpecialistForm v-model="showModal" :form="form" @submit="submitForm" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useSpecialistStore } from "@/stores/specialist";
import { Users, Plus } from "lucide-vue-next";
import SpecialistForm from "@/components/admin/SpecialistForm.vue";

const specialistStore = useSpecialistStore();
const showModal = ref(false); 

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

onMounted(() => {
  specialistStore.getSpecialists();
});

async function submitForm(data, setError) {
  try {
    const created = await specialistStore.addSpecialist(data);

    showModal.value = false;
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

    await specialistStore.getSpecialists();
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Noma'lum xato yuz berdi";
    if (typeof setError === "function") {
      setError(message);
    }
  }
}
</script>
