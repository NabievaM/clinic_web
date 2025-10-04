<template>
  <div
    v-if="clinicStore.loading"
    class="flex items-center gap-2 text-gray-500 justify-center"
  >
    <svg
      class="animate-spin h-6 w-6 text-primary"
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
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    <span class="text-lg">Yuklanmoqda...</span>
  </div>

  <div
    v-if="clinicStore.error"
    class="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center"
  >
    ❌ {{ clinicStore.error }}
  </div>

  <div v-if="!clinicStore.loading && clinicStore.clinic">
    <div
      class="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row gap-6"
    >
      <div class="flex-shrink-0 flex justify-center items-start">
        <img
          :src="getLogoUrl(clinicStore.clinic.logo_url)"
          alt="Logo"
          class="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
        />
      </div>

      <div class="flex-1 space-y-3">
        <h2 class="text-2xl font-bold text-gray-800 text-center md:text-left">
          {{ clinicStore.clinic.name }}
        </h2>

        <p class="text-gray-600">
          <strong>Manzil:</strong> {{ clinicStore.clinic.address }}
        </p>
        <p class="text-gray-600">
          <strong>Telefon:</strong> {{ clinicStore.clinic.phone }}
        </p>
        <p class="text-gray-600">
          <strong>Email:</strong> {{ clinicStore.clinic.email }}
        </p>

        <div>
          <strong class="text-gray-700">Ish vaqtlari:</strong>
          <p
            class="whitespace-pre-line text-gray-600 bg-gray-50 p-2 rounded-lg"
          >
            {{ clinicStore.clinic.working_hours }}
          </p>
        </div>

        <p class="text-gray-600">
          <strong>Joylashuv:</strong> {{ clinicStore.clinic.map_location }}
        </p>
        <p class="text-gray-500 text-sm">
          📅 Qo‘shilgan: {{ formatDate(clinicStore.clinic.createdAt) }} | 🔄
          Yangilangan: {{ formatDate(clinicStore.clinic.updatedAt) }}
        </p>
      </div>
    </div>
  </div>

  <div
    v-if="!clinicStore.loading && !clinicStore.clinic"
    class="text-gray-500 mt-6 text-center"
  >
    Klinik ma’lumot topilmadi 🙅‍♂️
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useClinicStore } from "@/stores/clinic";

const clinicStore = useClinicStore();

onMounted(() => {
  clinicStore.getClinic();
});

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLogoUrl(logo) {
  return logo ? `http://localhost:3000/uploads/${logo}` : "";
}
</script>

<style scoped>
.text-primary {
  color: #007dc5;
}
</style>
