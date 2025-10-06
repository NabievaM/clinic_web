<template>
  <div class="flex justify-end mb-2">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Yutuq qo‘shish</span>
    </button>
  </div>

  <div
    v-if="achievementStore.loading"
    class="flex items-center gap-2 text-gray-500"
  >
    <svg
      class="animate-spin h-5 w-5 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    Yuklanmoqda...
  </div>

  <div
    v-if="achievementStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ achievementStore.error }}
  </div>

  <div
    v-if="!achievementStore.loading && achievementStore.achievements.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200 text-center">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3">ID</th>
          <th class="px-4 py-3">Sarlavha</th>
          <th class="px-4 py-3">Sana</th>
          <th class="px-4 py-3">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="a in sortedAchievements"
          :key="a.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ a.id }}</td>
          <td class="px-4 py-3">{{ a.title }}</td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(a.achieved_date).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-center gap-3">
              <router-link
                :to="`/admin/achievement/${a.id}`"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Batafsil
              </router-link>
              <button
                @click="openDeleteModal(a)"
                class="flex items-center justify-center w-6 h-6 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!achievementStore.loading && achievementStore.achievements.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Yutuqlar</h2>
      <Award class="w-5 h-7" />
    </div>

    <div
      v-for="a in sortedAchievements"
      :key="a.id"
      class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <button
        @click="openDeleteModal(a)"
        class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
      >
        <Trash2 class="w-4 h-4" />
      </button>

      <p class="text-sm font-semibold text-gray-800">🏆 {{ a.title }}</p>
      <p class="text-xs text-gray-500 mt-1">
        🗓 {{ new Date(a.achieved_date).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/achievement/${a.id}`"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <div
    v-if="!achievementStore.loading && !achievementStore.achievements.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday yutuq topilmadi 🙅‍♂️
  </div>

  <AchievementForm v-model="showModal" :form="form" @submit="submitForm" />

  <DeleteModal
    :visible="showDelete"
    :title="deleteTitle"
    :message="deleteMessage"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { Plus, Award, Trash2 } from "lucide-vue-next";
import { useAchievementStore } from "@/stores/achievement";
import AchievementForm from "@/components/admin/AchievementForm.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";

const achievementStore = useAchievementStore();
const showModal = ref(false);
const showDelete = ref(false);
const deleteAchievementData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");

const form = ref({
  title: "",
  description: "",
  achieved_date: "",
  image: "",
});

const sortedAchievements = computed(() =>
  [...achievementStore.achievements].sort((a, b) => a.id - b.id)
);

onMounted(() => {
  achievementStore.getAchievements();
});

async function submitForm(data, setError) {
  try {
    await achievementStore.addAchievement(data);
    showModal.value = false;
    form.value = { title: "", description: "", achieved_date: "", image: "" };
    await achievementStore.getAchievements();
  } catch (error) {
    setError(error.message);
  }
}

function openDeleteModal(achievement) {
  deleteAchievementData.value = achievement;
  deleteTitle.value = "Yutuqni o‘chirish";
  deleteMessage.value = `"${achievement.title}" yutuqni rostan ham o‘chirmoqchimisiz?`;
  showDelete.value = true;
}

async function confirmDelete() {
  await achievementStore.removeAchievement(deleteAchievementData.value.id);
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
