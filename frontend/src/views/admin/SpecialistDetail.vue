<template>
  <router-link
    to="/admin/specialists"
    class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 hover:shadow transition-all text-sm font-medium"
  >
    ⬅️ Ortga
  </router-link>

  <div v-if="specialist" class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row items-start gap-10">
      <div class="flex-shrink-0 w-full md:w-1/3">
        <img
          :src="`http://localhost:3000/uploads/${specialist.photo}`"
          alt="mutaxassis rasmi"
          class="w-full h-[400px] object-cover rounded-2xl shadow-md"
        />
      </div>

      <div class="flex-1">
        <h1 class="text-4xl md:text-4xl font-bold text-gray-900 mb-2">
          {{ specialist.user.full_name }}
        </h1>
        <p class="text-primary text-lg md:text-xl font-semibold mb-6">
          {{ specialist.position }}
        </p>

        <div class="flex flex-wrap gap-3 mb-8">
          <span
            class="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100"
          >
            Tajriba: {{ specialist.experience_years }}
          </span>

          <span
            v-if="specialist.specialization"
            class="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium border border-purple-100"
          >
            {{ specialist.specialization }}
          </span>

          <div class="flex flex-wrap gap-2 items-center">
            <span class="font-semibold text-gray-800 mr-2">Ish kunlari:</span>
            <span
              v-for="(day, index) in specialist.working_days.split('\\n')"
              :key="index"
              class="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium border border-green-100"
            >
              {{ day }}
            </span>
          </div>
        </div>

        <p class="text-gray-700 text-lg leading-relaxed">
          {{ specialist.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSpecialistStore } from "@/stores/specialist";
import { storeToRefs } from "pinia";

const route = useRoute();
const store = useSpecialistStore();
const { specialist } = storeToRefs(store);

onMounted(() => {
  store.getSpecialistById(route.params.id);
});
</script>
