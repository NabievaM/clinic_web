<template>
  <AppLayout>
    <router-link
      to="/specialists"
      class="inline-flex items-center text-lg font-medium text-primary pt-8 pl-8 hover:text-blue-700 transition-colors"
    >
      <svg
        class="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Ortga qaytish
    </router-link>

    <div v-if="specialist" class="max-w-6xl mx-auto px-6 py-16">
      <div class="flex flex-col md:flex-row items-start gap-12">
        <div class="flex-shrink-0 w-full md:w-1/3">
          <img
            :src="`http://localhost:3000/uploads/${specialist.photo}`"
            alt="mutaxassis rasmi"
            class="w-full h-[400px] object-cover rounded-2xl shadow-md"
          />
        </div>

        <div class="flex-1">
          <h1 class="text-4xl font-bold text-gray-900 mb-3">
            {{ specialist.user.full_name }}
          </h1>
          <p class="text-primary text-xl font-semibold mb-6">
            {{ specialist.position }}
          </p>

          <div class="flex flex-wrap gap-3 mb-8 items-start">
            <span
              class="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm"
            >
              Tajriba: {{ specialist.experience_years }}
            </span>

            <span
              v-if="specialist.specialization"
              class="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm"
            >
              {{ specialist.specialization }}
            </span>

            <div class="flex flex-wrap gap-2 items-center">
              <span class="font-semibold text-gray-800 mr-2">Ish kunlari:</span>
              <span
                v-for="(day, index) in specialist.working_days.split('\\n')"
                :key="index"
                class="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm"
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
  </AppLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSpecialistStore } from "@/stores/specialist";
import { storeToRefs } from "pinia";
import AppLayout from "../layouts/AppLayout.vue";

const route = useRoute();
const store = useSpecialistStore();
const { specialist } = storeToRefs(store);

onMounted(() => {
  store.getSpecialistById(route.params.id);
});
</script>
