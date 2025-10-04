<template>
  <div v-if="bannerStore.loading" class="flex justify-center items-center py-6 text-gray-500 text-sm font-medium">
    ⏳ Yuklanmoqda...
  </div>

  <div v-if="bannerStore.error" class="text-red-500 text-center py-4 text-sm font-medium">
    ❌ {{ bannerStore.error }}
  </div>

  <router-link
    to="/admin/banners"
    class="mb-5 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition text-sm font-medium"
  >
    ⬅️ Ortga
  </router-link>

  <div v-if="bannerStore.banner" class="flex flex-col lg:flex-row gap-8">
    <div class="lg:w-2/3 flex justify-center items-center">
      <img
        v-if="bannerStore.banner.image"
        :src="getImageUrl(bannerStore.banner.image)"
        alt="Banner"
        class="rounded-2xl shadow-lg w-full max-h-[600px] object-contain"
      />
    </div>

    <div class="lg:w-1/3 flex flex-col gap-4">
      <h1 class="text-2xl lg:text-2.5xl font-bold text-primary">
        {{ bannerStore.banner.title }}
      </h1>
      <p class="text-gray-700 text-sm lg:text-base font-semibold leading-relaxed">
        {{ bannerStore.banner.subtitle }}
      </p>

      <div class="space-y-2 text-gray-700 text-sm">
        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>ID:</b> {{ bannerStore.banner.id }}
        </div>
        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>Ko‘rsatish tartibi:</b> {{ bannerStore.banner.display_order }}
        </div>
        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>Qo‘shilgan sana:</b>
          {{ new Date(bannerStore.banner.createdAt).toLocaleDateString("uz-UZ") }}
        </div>
        <div class="bg-gray-50 p-3 rounded-lg shadow-sm">
          <b>Yangilangan sana:</b>
          {{ new Date(bannerStore.banner.updatedAt).toLocaleDateString("uz-UZ") }}
        </div>
      </div>
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
