<template>
  <div v-if="bannerStore.loading" class="text-gray-500">⏳ Yuklanmoqda...</div>
  <div v-if="bannerStore.error" class="text-red-500">
    ❌ {{ bannerStore.error }}
  </div>

  <router-link
    to="/admin/banners"
    class="mb-3 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
  >
    ⬅️ Ortga
  </router-link>

  <div v-if="bannerStore.banner" class="bg-white p-2 rounded-xl shadow-md">
    <img
      :src="getImageUrl(bannerStore.banner.image)"
      alt="Banner"
      class="w-full h-80 object-cover rounded-lg mb-4"
    />

    <h2 class="text-2xl font-bold text-gray-800">
      {{ bannerStore.banner.title }}
    </h2>
    <p class="text-gray-600">{{ bannerStore.banner.subtitle }}</p>

    <div class="mt-4 space-y-2 text-sm text-gray-700">
      <p><b>ID:</b> {{ bannerStore.banner.id }}</p>
      <p><b>Ko‘rsatish tartibi:</b> {{ bannerStore.banner.display_order }}</p>
      <p>
        <b>Qo‘shilgan sana:</b>
        {{ new Date(bannerStore.banner.createdAt).toLocaleDateString("uz-UZ") }}
      </p>
      <p>
        <b>Yangilangan sana:</b>
        {{ new Date(bannerStore.banner.updatedAt).toLocaleDateString("uz-UZ") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBannerStore } from "@/stores/useBannerStore";

const route = useRoute();
const bannerStore = useBannerStore();

onMounted(() => {
  bannerStore.getBanner(route.params.id);
});

function getImageUrl(image) {
  return `http://localhost:3000/uploads/${image}`;
}
</script>
