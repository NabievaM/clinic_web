<template>
  <AppLayout>
    <BannerSlider />

    <div class="max-w-7xl mx-auto px-6 py-12">
      <h2 class="text-3xl text-primary text-center font-bold">
        Bizning xizmatlarimiz
      </h2>
      <div class="mb-5 text-right">
        <router-link
          to="/services"
          class="text-primary items-left hover:underline text-lg font-medium"
        >
          Barchasini ko‘rish →
        </router-link>
      </div>

      <div v-if="serviceLoading" class="text-center text-gray-500">
        Yuklanmoqda...
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard
          v-for="service in limitedServices"
          :key="service.id"
          :service="service"
        />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <h2 class="text-3xl text-primary text-center font-bold">
        Bizning mutaxassislar
      </h2>
      <div class="mb-5 text-right">
        <router-link
          to="/specialists"
          class="text-primary hover:underline text-lg font-medium"
        >
          Barchasini ko‘rish →
        </router-link>
      </div>

      <div v-if="specLoading" class="text-center text-gray-500">
        Yuklanmoqda...
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SpecialistCard
          v-for="specialist in limitedSpecialists"
          :key="specialist.id"
          :specialist="specialist"
        />
      </div>
    </div>

    <Achievement />
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import BannerSlider from "@/components/BannerSlider.vue";
import Achievement from "@/views/Achievement.vue";
import ServiceCard from "@/components/ServiceCard.vue";
import SpecialistCard from "@/components/SpecialistCard.vue";

import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useServiceStore } from "@/stores/service";
import { useSpecialistStore } from "@/stores/specialist";

const serviceStore = useServiceStore();
const { services, loading: serviceLoading } = storeToRefs(serviceStore);

const specialistStore = useSpecialistStore();
const { specialists, loading: specLoading } = storeToRefs(specialistStore);

onMounted(() => {
  serviceStore.fetchServices();
  specialistStore.getSpecialists();
});

const limitedServices = computed(() => services.value.slice(0, 3));
const limitedSpecialists = computed(() => specialists.value.slice(0, 3));
</script>
