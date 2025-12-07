<template>
  <div>
    <router-link
      to="/admin/specialist-services"
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 hover:shadow transition-all text-sm font-medium"
    >
      ⬅️ Ortga
    </router-link>

    <div v-if="loading" class="flex items-center gap-2 text-gray-500">
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
      v-if="error"
      class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
    >
      ❌ {{ error }}
    </div>

    <div v-if="mapping" class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-start gap-10">
        <div class="flex-shrink-0 w-full md:w-1/3">
          <img
            v-if="mapping.specialist?.photo"
            :src="`http://localhost:3001/uploads/${mapping.specialist.photo}`"
            alt="mutaxassis rasmi"
            class="w-full h-[400px] object-cover rounded-2xl shadow-md"
          />
        </div>

        <div class="flex-1">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            {{ mapping.specialist?.user?.full_name }}
          </h1>
          <p class="text-primary text-lg font-semibold mb-6">
            {{ mapping.specialist?.position }}
          </p>

          <div class="flex flex-wrap gap-3 mb-8">
            <span class="badge bg-blue-50 text-blue-700 border-blue-100">
              Tajriba: {{ mapping.specialist?.experience_years }}
            </span>
            <span class="badge bg-yellow-50 text-yellow-700 border-yellow-100">
              Xizmat: {{ mapping.service?.name }}
            </span>
            <span class="badge bg-green-50 text-green-700 border-green-100">
              Narx: {{ formatPrice(mapping.service?.price) }}
            </span>
            <span class="badge bg-gray-50 text-gray-700 border-gray-100">
              ⏱ {{ mapping.service?.duration }} daqiqa
            </span>
          </div>

          <div
            v-if="mapping?.specialist?.working_days"
            class="bg-green-100 mb-6 text-green-700 py-1.5 px-4 rounded-lg text-sm whitespace-pre-line"
          >
            <p class="text-lg font-medium">Ish kunlari:</p>
            {{ mapping.specialist.working_days }}
          </div>

          <p class="text-gray-700 text-lg leading-relaxed mb-6">
            {{ mapping.specialist?.description }}
          </p>

          <hr class="my-6" />

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">Xizmat haqida</h3>
            <p class="text-gray-700 mb-2">{{ mapping.service?.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && !mapping"
      class="text-gray-500 mt-4 text-center"
    >
      Ma'lumot topilmadi 🙅‍♂️
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useSpecialistServiceStore } from "@/stores/specialistService";
import { storeToRefs } from "pinia";

const route = useRoute();
const store = useSpecialistServiceStore();
const { selected, loading, error } = storeToRefs(store);
const mapping = selected;

onMounted(async () => {
  const stateMapping = history.state && history.state.mapping;
  if (stateMapping) {
    store.selected = stateMapping;
    return;
  }
  await store.fetchMapping(route.params.id);
});

function formatPrice(price) {
  if (!price) return "0 so‘m";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}
</script>
