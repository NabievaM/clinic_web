<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-6 py-10">
      <h2 class="text-3xl text-primary font-bold mb-10 text-center">
        Bizning mutaxassislar
      </h2>

      <p v-if="loading" class="text-gray-500 text-center">
        Mutaxassislar yuklanmoqda...
      </p>

      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <SpecialistCard
          v-for="spec in specialists"
          :key="spec.id"
          :specialist="spec"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSpecialistStore } from "@/stores/specialist";
import SpecialistCard from "@/components/SpecialistCard.vue";
import AppLayout from "../layouts/AppLayout.vue";

const store = useSpecialistStore();

onMounted(() => {
  store.getSpecialists();
});

const { specialists, loading, error } = storeToRefs(store);
</script>
