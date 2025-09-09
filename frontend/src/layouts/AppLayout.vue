<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-800">
    <Navbar />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>
