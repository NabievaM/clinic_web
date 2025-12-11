<template>
  <router-link
    to="/admin/specialists"
    class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 hover:shadow transition-all text-sm font-medium"
  >
    ⬅️ Ortga
  </router-link>

  <div v-if="loading" class="text-center text-gray-500 py-10">
    Yuklanmoqda...
  </div>

  <div v-else-if="specialist && specialist.user" class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row items-start gap-10">
      <div class="flex-shrink-0 w-full md:w-1/3 relative">
        <img
          :src="photoUrl"
          alt="mutaxassis rasmi"
          class="w-full h-[400px] object-cover rounded-2xl shadow-md"
        />
        <button
          @click="showEditModal = true"
          class="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:shadow-md transition"
        >
          <Edit class="w-5 h-5 text-primary" />
        </button>
      </div>

      <div class="flex-1">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          {{ specialist.user.full_name }}
        </h1>
        <p class="text-primary text-lg font-semibold mb-6">
          {{ specialist.position }}
        </p>

        <div class="flex flex-wrap gap-3 mb-8">
          <span
            class="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100"
          >
            Tajriba: {{ specialist.experience_years }}
          </span>

          <span
            v-if="specialist.specialization"
            class="bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium border border-purple-100"
          >
            {{ specialist.specialization }}
          </span>
        </div>

        <div
          v-if="specialist.working_days"
          class="bg-green-100 text-green-700 py-1.5 px-4 rounded-lg text-sm whitespace-pre-line mb-8"
        >
          <p class="text-lg font-medium">Ish kunlari:</p>
          {{ specialist.working_days }}
        </div>

        <p
          v-if="specialist.description"
          class="text-gray-700 text-lg leading-relaxed"
        >
          {{ specialist.description }}
        </p>
      </div>
    </div>
  </div>

  <EditModal
    v-if="showEditModal"
    :visible="showEditModal"
    title="Rasmni tahrirlash"
    :formData="{ photo: null }"
    :fields="[{ label: 'Rasm', model: 'photo', type: 'file', colSpan: 2 }]"
    :error="error"
    @save="handlePhotoSave"
    @cancel="showEditModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSpecialistStore } from "@/stores/specialist";
import { storeToRefs } from "pinia";
import EditModal from "@/components/admin/common/EditModal.vue";
import { Edit } from "lucide-vue-next";
import { updateSpecialistPhoto } from "@/api/specialist";

const route = useRoute();
const store = useSpecialistStore();
const { specialist } = storeToRefs(store);

const loading = ref(true);
const showEditModal = ref(false);
const error = ref(null);

onMounted(async () => {
  try {
    await store.getSpecialistById(route.params.id);
  } finally {
    loading.value = false;
  }
});

const photoUrl = computed(() =>
  specialist.value?.photo
    ? `http://localhost:3001/uploads/${specialist.value.photo}`
    : "https://via.placeholder.com/400x400?text=No+Photo"
);

async function handlePhotoSave(formData) {
  error.value = null;
  if (!formData.photo) {
    error.value = "Rasm tanlanmagan";
    return;
  }
  try {
    const fd = new FormData();
    fd.append("photo", formData.photo);
    await updateSpecialistPhoto(specialist.value.id, fd);
    await store.getSpecialistById(specialist.value.id);
    showEditModal.value = false;
  } catch (err) {
    error.value = err.response?.data?.message || "Rasmni yangilashda xatolik";
  }
}
</script>
