<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h2 class="text-3xl text-primary font-bold mb-10 text-center">Xizmatlar</h2>

    <div v-if="loading" class="text-gray-500 text-center">Yuklanmoqda...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-white rounded-2xl shadow-md border-t border-gray-100 p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center mb-4">
          <div
            class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4"
          >
            <i class="fa-solid fa-stethoscope"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">
            {{ service.name }}
          </h3>
        </div>

        <p class="text-gray-600 mb-4 line-clamp-3">
          {{ service.description }}
        </p>

        <div class="flex justify-between text-sm text-gray-700">
          <span><strong>Narxi:</strong> ${{ service.price }}</span>
          <span><strong>Davomiyligi:</strong> {{ service.duration }} min</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useServiceStore } from "../stores/service";

const serviceStore = useServiceStore();
const { services, loading, error } = storeToRefs(serviceStore);

onMounted(() => {
  serviceStore.fetchServices();
});
</script>
