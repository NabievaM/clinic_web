<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <h2 class="text-3xl text-primary font-bold mb-10 text-center">
      Bizning mutaxassislar
    </h2>

    <p v-if="loading" class="text-gray-500 text-center">
      Mutaxassislar yuklanmoqda...
    </p>

    <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="spec in specialists"
        :key="spec.id"
        class="bg-white rounded-xl shadow-xl border-t border-gray-100 hover:shadow-md transition-transform transform hover:-translate-y-1 overflow-hidden text-center"
      >
        <div class="p-4 flex flex-col items-center">
          <img
            :src="`http://localhost:3000/uploads/${spec.photo}`"
            alt="mutaxassis rasmi"
            class="w-20 h-20 rounded-full object-cover shadow mb-3"
          />
          <h3 class="text-xl font-semibold text-gray-800">
            {{ spec.full_name }}
          </h3>
          <p class="text-primary text-lg">{{ spec.position }}</p>

          <span
            class="mt-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
          >
            {{ spec.experience_years }} yil tajriba
          </span>

          <p class="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2">
            {{ spec.description }}
          </p>

          <router-link
            :to="`/specialist/${spec.id}`"
            class="mt-3 text-primary font-medium hover:underline text-sm"
          >
            Batafsil →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSpecialistStore } from "@/stores/specialist";

const store = useSpecialistStore();

onMounted(() => {
  store.getSpecialists();
});

const { specialists, loading, error } = storeToRefs(store);
</script>
