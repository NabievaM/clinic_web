<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-6 py-4">
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
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
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
              <th class="th">Sana</th>
              <th class="th">Amallar</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in paginatedResults"
              :key="r.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="th font-medium">{{ r.id }}</td>
              <td class="th">{{ r.booking_id }}</td>
              <td class="th max-w-[200px]">
                <span class="block truncate" :title="r.description">{{
                  r.description
                }}</span>
              </td>
              <td class="th text-gray-500">
                {{ formatDate(r.createdAt) }}
              </td>
              <td class="th">
                <router-link
                  :to="`/patient/analysis-results/${r.id}`"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
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
        <div class="flex gap-2 font-bold text-primary items-center">
          <TestTube2 class="w-5 h-5" />
          <h2 class="text-lg">Analiz natijalarim</h2>
        </div>

        <div
          v-for="r in paginatedResults"
          :key="r.id"
          class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <p class="text-sm font-semibold flex items-center gap-1">
            <FileText class="w-4 h-4 text-blue-500" />
            <span class="breal-all max-w-[200px]">{{ r.description }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar class="w-4 h-4 text-gray-400" />
            {{ formatDate(r.createdAt) }}
          </p>

          <router-link
            :to="`/patient/analysis-results/${r.id}`"
            class="inline-block mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded"
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
          Hozircha analiz natijalari yo‘q
        </h3>

        <p class="text-sm text-gray-500 max-w-sm mb-5">
          Qabuldan so‘ng analiz natijalaringiz shu yerda paydo bo‘ladi
        </p>

        <router-link
          to="/services"
          class="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium shadow hover:shadow-lg hover:bg-primary/90 transition"
        >
          Qabulga yozilish
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useAnalysisResultStore } from "@/stores/analysisResult";
import { TestTube2, Calendar, FileText } from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import Pagination from "@/components/common/Pagination.vue";

const analysisStore = useAnalysisResultStore();

const page = ref(1);
const limit = ref(10);

onMounted(() => {
  analysisStore.getResultsForPatient();
});

const paginatedResults = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...analysisStore.results]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

watch(
  () => analysisStore.results.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

function formatDate(date) {
  return new Date(date).toLocaleDateString("uz-UZ");
}
</script>
