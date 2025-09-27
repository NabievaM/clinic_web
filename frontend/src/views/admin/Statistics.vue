<template>
  <div
    v-if="loading"
    class="flex items-center justify-center gap-2 text-gray-500"
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
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    Yuklanmoqda...
  </div>

  <div
    v-if="error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ error }}
  </div>

  <div
    v-if="!loading && !error && !statistics.length"
    class="text-gray-500 text-center mt-6"
  >
    Hech qanday statistika topilmadi 🙅‍♂️
  </div>

  <div v-if="!loading && !error && statistics.length">
    <div class="flex gap-2 font-bold text-primary md:hidden mb-4">
      <h2 class="text-xl">Statistika</h2>
      <BarChart class="w-5 h-7" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-xl shadow border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Bronlar soni</h2>
        <apexchart
          type="line"
          height="300"
          :options="bookingChart.options"
          :series="bookingChart.series"
        />
      </div>

      <div class="bg-white p-4 rounded-xl shadow border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Yangi foydalanuvchilar
        </h2>
        <apexchart
          type="bar"
          height="300"
          :options="userChart.options"
          :series="userChart.series"
        />
      </div>

      <div>Mashhur hizmatlar qoshiladi bu qismiga</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStatisticsStore } from "@/stores/statistics";
import { BarChart } from "lucide-vue-next";

const store = useStatisticsStore();

const statistics = computed(() => store.list);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(() => {
  store.getStatistics();
});

const bookingChart = computed(() => ({
  options: {
    chart: { id: "bookings-line" },
    xaxis: { categories: statistics.value.map((s) => s.date).reverse() },
    stroke: { curve: "smooth" },
  },
  series: [
    {
      name: "Bronlar",
      data: statistics.value.map((s) => s.bookings_count).reverse(),
    },
  ],
}));

const userChart = computed(() => ({
  options: {
    chart: { id: "users-bar" },
    xaxis: { categories: statistics.value.map((s) => s.date).reverse() },
  },
  series: [
    {
      name: "Yangi foydalanuvchilar",
      data: statistics.value.map((s) => s.user_count).reverse(),
    },
  ],
}));
</script>
