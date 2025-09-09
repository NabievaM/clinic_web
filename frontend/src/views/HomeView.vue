<template>
  <AppLayout>
    <div>
      <BannerSlider />

      <section id="services">
        <Service />
      </section>

      <section id="experts">
        <Specialist />
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import BannerSlider from "../components/BannerSlider.vue";
import Service from "../components/ServiceList.vue";
import Specialist from "../components/SpecialistList.vue";
</script>
