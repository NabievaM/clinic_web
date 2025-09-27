<template>
  <div v-if="bannerStore.loading" class="flex items-center gap-2 text-gray-500">
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
    v-if="bannerStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ bannerStore.error }}
  </div>

  <div
    v-if="!bannerStore.loading && bannerStore.banners.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Sarlavha</th>
          <th class="px-4 py-3 text-left">Qo‘shilgan sana</th>
          <th class="px-4 py-3 text-left">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="b in [...bannerStore.banners].sort(
            (a, b) => a.display_order - b.display_order
          )"
          :key="b.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ b.id }}</td>
          <td class="px-4 py-3">{{ b.title }}</td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(b.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3">
            <router-link
              :to="`/admin/banner/${b.id}`"
              class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Batafsil
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!bannerStore.loading && bannerStore.banners.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Bannerlar</h2>
      <Image class="w-5 h-7" />
    </div>

    <div
      v-for="b in [...bannerStore.banners].sort(
        (a, b) => a.display_order - b.display_order
      )"
      :key="b.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <p class="text-sm font-semibold text-gray-800">📌 {{ b.title }}</p>
      <p class="text-xs text-gray-500 mt-1">
        🗓 {{ new Date(b.createdAt).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/banner/${b.id}`"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <div
    v-if="!bannerStore.loading && !bannerStore.banners.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday banner topilmadi 🙅‍♂️
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useBannerStore } from "@/stores/useBannerStore";
import { Image } from "lucide-vue-next";

const bannerStore = useBannerStore();

onMounted(() => {
  bannerStore.getBanners();
});
</script>
