<template>
  <div v-if="achievementStore.loading" class="text-gray-500">
    ⏳ Yuklanmoqda...
  </div>

  <div v-if="achievementStore.error" class="text-red-500">
    ❌ {{ achievementStore.error }}
  </div>

  <router-link
    to="/admin/achievements"
    class="mb-3 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
  >
    ⬅️ Ortga
  </router-link>

  <div
    v-if="achievementStore.achievement"
    class="bg-white p-2 rounded-xl shadow-md"
  >
    <img
      :src="getImageUrl(achievementStore.achievement.image)"
      alt="Achievement"
      class="w-full h-80 object-cover rounded-lg mb-4"
    />

    <h2 class="text-2xl font-bold text-gray-800">
      {{ achievementStore.achievement.title }}
    </h2>
    <p class="text-gray-600 mt-2">
      {{ achievementStore.achievement.description }}
    </p>

    <div class="mt-4 space-y-2 text-sm text-gray-700">
      <p><b>ID:</b> {{ achievementStore.achievement.id }}</p>
      <p>
        <b>Yutuq sanasi:</b>
        {{
          new Date(
            achievementStore.achievement.achieved_date
          ).toLocaleDateString("uz-UZ")
        }}
      </p>
      <p>
        <b>Qo‘shilgan sana:</b>
        {{
          new Date(achievementStore.achievement.createdAt).toLocaleDateString(
            "uz-UZ"
          )
        }}
      </p>
      <p>
        <b>Yangilangan sana:</b>
        {{
          new Date(achievementStore.achievement.updatedAt).toLocaleDateString(
            "uz-UZ"
          )
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAchievementStore } from "@/stores/achievement";

const route = useRoute();
const achievementStore = useAchievementStore();

onMounted(() => {
  achievementStore.getAchievement(route.params.id);
});

function getImageUrl(image) {
  return `http://localhost:3000/uploads/${image}`;
}
</script>
