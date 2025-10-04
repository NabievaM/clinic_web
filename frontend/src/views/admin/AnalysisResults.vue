<template>
  <div class="flex justify-end mb-2">
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
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Booking ID</th>
          <th class="px-4 py-3 text-left">Izoh</th>
          <th class="px-4 py-3 text-left">Qo‘shilgan sana</th>
          <th class="px-4 py-3 text-left">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="r in [...analysisStore.results].sort((a, b) => a.id - b.id)"
          :key="r.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ r.id }}</td>
          <td class="px-4 py-3">{{ r.booking_id }}</td>
          <td class="px-4 py-3">{{ r.description }}</td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(r.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3">
            <router-link
              :to="`/admin/analysis-result/${r.id}`"
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
    v-if="!analysisStore.loading && analysisStore.results.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Analiz natijalari</h2>
      <TestTube2 class="w-5 h-7" />
    </div>

    <div
      v-for="r in [...analysisStore.results].sort((a, b) => a.id - b.id)"
      :key="r.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <p class="text-sm font-semibold text-gray-800">📌 {{ r.description }}</p>
      <p class="text-xs text-gray-500 mt-1">
        🗓 {{ new Date(r.createdAt).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/analysis-result/${r.id}`"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <div
    v-if="!analysisStore.loading && !analysisStore.results.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday tahlil natijasi topilmadi 🙅‍♂️
  </div>

  <AnalysisResultForm v-model="showModal" :form="form" @submit="submitForm" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAnalysisResultStore } from "@/stores/analysisResult";
import { Plus, TestTube2 } from "lucide-vue-next";
import AnalysisResultForm from "@/components/admin/AnalysisResultForm.vue";

const analysisStore = useAnalysisResultStore();
const showModal = ref(false);

const form = ref({
  booking_id: "",
  file_url: "",
  description: "",
});

onMounted(() => {
  analysisStore.getResults();
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
</script>
