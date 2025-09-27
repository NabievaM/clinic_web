<template>
  <div
    v-if="serviceStore.loading"
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
    v-if="serviceStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ serviceStore.error }}
  </div>

  <div
    v-if="!serviceStore.loading && serviceStore.services.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Xizmat nomi</th>
          <th class="px-4 py-3 text-left">Narxi</th>
          <th class="px-4 py-3 text-left">Davomiyligi</th>
          <th class="px-4 py-3 text-left">Tavsif</th>
          <th class="px-4 py-3 text-left">Mashhur</th>
          <th class="px-4 py-3 text-left">Qo‘shildi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="s in [...serviceStore.services].sort((a, b) => a.id - b.id)"
          :key="s.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ s.id }}</td>
          <td class="px-4 py-3">{{ s.name }}</td>
          <td class="px-4 py-3 text-green-600 font-semibold">
            {{ formatPrice(s.price) }}
          </td>
          <td class="px-4 py-3">{{ s.duration }} daqiqa</td>
          <td class="px-4 py-3 text-gray-600">{{ s.description }}</td>
          <td class="px-4 py-3">
            <span
              v-if="s.is_popular"
              class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full font-semibold"
            >
              ⭐ Ha
            </span>
            <span
              v-else
              class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full"
            >
              Yo‘q
            </span>
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!serviceStore.loading && serviceStore.services.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Xizmatlar ro‘yxati</h2>
      <Stethoscope class="w-5 h-7" />
    </div>

    <div
      v-for="s in [...serviceStore.services].sort((a, b) => a.id - b.id)"
      :key="s.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ s.name }}</h3>
        <span
          v-if="s.is_popular"
          class="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full font-semibold"
        >
          ⭐ Mashhur
        </span>
      </div>
      <p class="text-sm text-gray-600">💰 {{ formatPrice(s.price) }}</p>
      <p class="text-sm text-gray-600">⏱ {{ s.duration }} daqiqa</p>
      <p class="text-sm text-gray-600">📝 {{ s.description }}</p>
      <p class="text-xs text-gray-500 mt-2">
        🗓 {{ new Date(s.createdAt).toLocaleDateString("uz-UZ") }}
      </p>
    </div>
  </div>

  <div
    v-if="!serviceStore.loading && !serviceStore.services.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday xizmat topilmadi 🙅‍♂️
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useServiceStore } from "@/stores/service";
import { Stethoscope } from "lucide-vue-next";

const serviceStore = useServiceStore();

onMounted(() => {
  serviceStore.fetchServices();
});

function formatPrice(price) {
  if (!price) return "0 so‘m";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}
</script>
