<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-6 py-10">
      <h2 class="text-3xl text-primary font-bold mb-10 text-center">
       Bizning xizmatlarimiz
      </h2>

      <div v-if="loading" class="text-gray-500 text-center">Yuklanmoqda...</div>
      <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          v-for="service in services"
          :key="service.id"
          :service="service"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useServiceStore } from "@/stores/service";
import ServiceCard from "@/components/ServiceCard.vue";
import AppLayout from "../layouts/AppLayout.vue";

const serviceStore = useServiceStore();
const { services, loading, error } = storeToRefs(serviceStore);

onMounted(() => {
  serviceStore.fetchServices();
});
</script>
