<template>
  <div
    v-if="achievementStore.loading"
    class="flex justify-center items-center py-6 text-gray-500 text-sm font-medium"
  >
    ⏳ Yuklanmoqda...
  </div>

  <div
    v-if="achievementStore.error"
    class="text-red-500 text-center py-4 text-sm font-medium"
  >
    ❌ {{ achievementStore.error }}
  </div>

  <router-link
    to="/admin/achievements"
    class="mb-5 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition text-sm font-medium"
  >
    ⬅️ Ortga
  </router-link>

  <div
    v-if="achievementStore.achievement"
    class="flex flex-col lg:flex-row gap-8"
  >
    <div class="lg:w-2/3 flex justify-center items-center relative">
      <img
        v-if="achievementStore.achievement.image"
        :src="getImageUrl(achievementStore.achievement.image)"
        alt="Achievement"
        class="rounded-2xl shadow-lg w-full max-h-[600px] object-contain"
      />

      <button
        @click="showEditModal = true"
        class="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:shadow-md transition"
      >
        <Edit class="w-5 h-5 text-primary" />
      </button>
    </div>

    <div class="lg:w-1/3 flex flex-col gap-4">
      <h1 class="text-2xl lg:text-2.5xl font-bold text-primary">
        {{ achievementStore.achievement.title }}
      </h1>

      <p class="text-gray-700 text-sm lg:text-base leading-relaxed">
        {{ achievementStore.achievement.description }}
      </p>

      <div class="space-y-2 text-gray-700 text-sm">
        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>ID:</b> {{ achievementStore.achievement.id }}
        </div>

        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>Yutuq sanasi:</b>
          {{
            new Date(
              achievementStore.achievement.achieved_date
            ).toLocaleDateString("uz-UZ")
          }}
        </div>

        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>Qo‘shilgan sana:</b>
          {{
            new Date(achievementStore.achievement.createdAt).toLocaleDateString(
              "uz-UZ"
            )
          }}
        </div>

        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>Yangilangan sana:</b>
          {{
            new Date(achievementStore.achievement.updatedAt).toLocaleDateString(
              "uz-UZ"
            )
          }}
        </div>
      </div>
    </div>
  </div>

  <EditModal
    v-if="showEditModal"
    :visible="showEditModal"
    title="Rasmni tahrirlash"
    :formData="{ image: null }"
    :fields="[{ label: 'Rasm', model: 'image', type: 'file', colSpan: 2 }]"
    :error="error"
    @save="handleImageSave"
    @cancel="showEditModal = false"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAchievementStore } from "@/stores/achievement";
import EditModal from "@/components/admin/common/EditModal.vue";
import { Edit } from "lucide-vue-next";

const route = useRoute();
const achievementStore = useAchievementStore();
const showEditModal = ref(false);
const error = ref(null);

onMounted(() => {
  achievementStore.getAchievement(route.params.id);
});

function getImageUrl(image) {
  return `http://localhost:3001/uploads/${image}`;
}

async function handleImageSave(formData) {
  error.value = null;
  if (!formData.image) {
    error.value = "Rasm tanlanmagan";
    return;
  }
  try {
    await achievementStore.changeAchievementImage(
      achievementStore.achievement.id,
      formData.image
    );
    await achievementStore.getAchievement(achievementStore.achievement.id);
    showEditModal.value = false;
  } catch (e) {
    error.value = e.message || "Rasmni yangilashda xatolik";
  }
}
</script>
