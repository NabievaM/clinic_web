<template>
  <div class="max-w-6xl mx-auto px-6 pt-10">
    <h2 class="text-3xl font-bold mb-10 text-center text-primary">
      Yutuqlarimiz
    </h2>

    <div v-if="achievementStore.loading" class="text-center text-gray-500">
      Yuklanmoqda...
    </div>
    <div v-else-if="achievementStore.error" class="text-center text-red-500">
      {{ achievementStore.error }}
    </div>

    <div v-else class="relative border-l border-gray-200">
      <div
        v-for="item in achievementStore.achievements"
        :key="item.id"
        class="mb-5 ml-6"
      >
        <span
          class="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-8 ring-white"
        >
          <Trophy class="w-3 h-3 text-white" />
        </span>

        <div
          class="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
        >
          <img
            :src="`http://localhost:3001/uploads/${item.image}`"
            alt="achievement image"
            class="w-full md:w-64 h-40 object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
          />

          <div class="p-5 flex-1">
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"
            >
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              {{ item.description }}
            </p>
            <p class="text-xs text-primary flex items-center gap-1">
              <Calendar class="w-4 h-4 text-primary" />
              {{ item.achieved_date }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAchievementStore } from "@/stores/achievement";
import { Trophy, Calendar } from "lucide-vue-next";

const achievementStore = useAchievementStore();

onMounted(() => {
  achievementStore.getAchievements();
});
</script>
