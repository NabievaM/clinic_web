<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto px-6 py-2">
      <div class="flex justify-end mb-2">
        <button
          @click="showModal = true"
          class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
        >
          <Plus class="w-4 h-4" />
          <span>Analiz natija qo‘shish</span>
        </button>
      </div>

      <div
        v-if="analysisStore.loading"
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
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        Yuklanmoqda...
      </div>

      <div v-if="analysisStore.error" class="text-red-500 py-2">
        ❌ {{ analysisStore.error }}
      </div>

      <div
        v-if="!analysisStore.loading && analysisStore.results.length"
        class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200 text-center">
          <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Booking ID</th>
              <th class="px-4 py-3">Izoh</th>
              <th class="px-4 py-3">Sana</th>
              <th class="px-4 py-3">Amallar</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in [...analysisStore.results].sort(
                (a, b) => a.id - b.id
              )"
              :key="r.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 font-medium">{{ r.id }}</td>
              <td class="px-4 py-3">{{ r.booking_id }}</td>
              <td class="px-4 py-3">{{ r.description }}</td>
              <td class="px-4 py-3 text-gray-500">
                {{ formatDate(r.createdAt) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <router-link
                    :to="`/specialist/analysis-results/${r.id}`"
                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Batafsil
                  </router-link>

                  <button
                    @click="openEditModal(r)"
                    class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!analysisStore.loading && analysisStore.results.length"
        class="space-y-4 md:hidden"
      >
        <div class="flex gap-2 font-bold text-primary items-center">
          <TestTube2 class="w-5 h-5" />
          <h2 class="text-lg">Analiz natijalari</h2>
        </div>

        <div
          v-for="r in [...analysisStore.results].sort((a, b) => a.id - b.id)"
          :key="r.id"
          class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <button
            @click="openEditModal(r)"
            class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500"
          >
            <Edit2 class="w-4 h-4" />
          </button>

          <p class="text-sm font-semibold">📌 {{ r.description }}</p>
          <p class="text-xs text-gray-500 mt-1">
            🗓 {{ formatDate(r.createdAt) }}
          </p>

          <router-link
            :to="`/specialist/analysis-results/${r.id}`"
            class="inline-block mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded"
          >
            Batafsil
          </router-link>
        </div>
      </div>

      <div
        v-if="!analysisStore.loading && !analysisStore.results.length"
        class="text-gray-500 mt-4 text-center"
      >
        Hech qanday analiz natijasi topilmadi 🙅‍♂️
      </div>
    </div>

    <AnalysisResultForm v-model="showModal" :form="form" @submit="submitForm" />

    <EditModal
      :visible="showEdit"
      title="Natijani tahrirlash"
      :formData="editData"
      :fields="editFields"
      :error="editError"
      @save="confirmEdit"
      @cancel="showEdit = false"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAnalysisResultStore } from "@/stores/analysisResult";
import { Plus, TestTube2, Edit2 } from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import AnalysisResultForm from "@/components/admin/AnalysisResultForm.vue";
import EditModal from "@/components/admin/common/EditModal.vue";

const analysisStore = useAnalysisResultStore();

const showModal = ref(false);
const showEdit = ref(false);
const editData = ref({});
const editError = ref("");

const form = ref({
  booking_id: "",
  file_url: "",
  description: "",
});

const editFields = [
  { label: "Booking ID", model: "booking_id", type: "text" },
  { label: "Izoh", model: "description", type: "text" },
];

onMounted(() => {
  analysisStore.getResultsForSpecialist();
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("uz-UZ");
}

async function submitForm(data, setError) {
  try {
    await analysisStore.addResult(data);
    showModal.value = false;
    form.value = { booking_id: "", file_url: "", description: "" };
    await analysisStore.getResultsForSpecialist();
  } catch (e) {
    setError?.(e.message);
  }
}

function openEditModal(r) {
  editData.value = { ...r };
  showEdit.value = true;
}

async function confirmEdit(updated) {
  editError.value = "";
  try {
    await analysisStore.updateResult(updated.id, updated);
    showEdit.value = false;
    await analysisStore.getResultsForSpecialist();
  } catch (e) {
    editError.value = e.message || "Xatolik yuz berdi";
  }
}
</script>
