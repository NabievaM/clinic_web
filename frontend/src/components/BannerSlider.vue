<template>
  <Swiper
    :modules="[Autoplay, Navigation, Pagination]"
    :slides-per-view="1"
    :loop="true"
    :autoplay="{ delay: 5000, disableOnInteraction: false }"
    :navigation="true"
    :pagination="{ clickable: true }"
    :speed="1200"
    class="w-full"
  >
    <SwiperSlide v-for="banner in banners" :key="banner.id">
      <div class="relative w-full">
        <img
          :src="getImageUrl(banner.image)"
          class="w-full h-64 md:h-96 object-cover"
        />
        <div
          class="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40"
        >
          <h2 class="text-md md:text-3xl font-bold text-center">
            {{ banner.title }}
          </h2>

          <p class="text-xs md:text-lg text-center mt-1">
            {{ banner.subtitle }}
          </p>
        </div>
      </div>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBannerStore } from "@/stores/useBannerStore";

const bannerStore = useBannerStore();
const { banners } = storeToRefs(bannerStore);

onMounted(() => {
  if (!banners.value.length) {
    bannerStore.getBanners();
  }
});

const getImageUrl = (image) =>
  `${import.meta.env.VITE_API_URL}/uploads/${image}`;
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(255, 255, 255, 0.4);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}

.swiper-pagination-bullet {
  background: white;
  opacity: 0.7;
}
.swiper-pagination-bullet-active {
  opacity: 1;
  background: #38bdf8;
}

@media (max-width: 767px) {
  .swiper-button-next,
  .swiper-button-prev {
    background: transparent !important;
    border: none !important;
    width: auto;
    height: auto;
  }

  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 14px;
    color: white;
    opacity: 0.7;
  }
}
</style>
