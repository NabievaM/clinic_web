<template>
  <footer class="bg-blue-600 text-white">
    <div
      class="max-w-7xl mx-auto px-6 py-3 grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      <div class="flex items-center space-x-4">
        <img
          v-if="clinic?.logo_url"
          :src="`http://localhost:3000/uploads/${clinic.logo_url}`"
          alt="logo"
          class="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
        />
        <h2 class="text-2xl font-bold tracking-wide">{{ clinic?.name }}</h2>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-3 border-b border-white/20 pb-1">
          Kontakt
        </h3>
        <p class="text-sm opacity-90 flex items-center gap-2">
          <MapPin class="w-4 h-4 text-yellow-300" /> {{ clinic?.address }}
        </p>
        <p class="text-sm opacity-90 flex items-center gap-2">
          <Phone class="w-4 h-4 text-yellow-300" />
          <a
            :href="`tel:${clinic?.phone}`"
            class="hover:text-yellow-300 transition"
            >{{ clinic?.phone }}</a
          >
        </p>
        <p class="text-sm opacity-90 flex items-center gap-2">
          <Mail class="w-4 h-4 text-yellow-300" />
          <a
            :href="`mailto:${clinic?.email}`"
            class="hover:text-yellow-300 transition"
            >{{ clinic?.email }}</a
          >
        </p>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-3 border-b border-white/20 pb-1">
          Ish vaqti
        </h3>
        <p class="text-sm opacity-90 flex items-center gap-2">
          <Clock class="w-4 h-4 text-yellow-300" /> {{ clinic?.working_hours }}
        </p>
      </div>
    </div>

    <div
      class="bg-blue-800 py-4 text-center text-gray-300 text-sm border-t border-white/10"
    >
      © 2025 {{ clinic?.name }}. Barcha huquqlar himoyalangan.
    </div>
  </footer>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useClinicStore } from "@/stores/clinic";
import { MapPin, Phone, Mail, Clock } from "lucide-vue-next";

const store = useClinicStore();
store.getClinic();
const { clinic } = storeToRefs(store);
</script>
