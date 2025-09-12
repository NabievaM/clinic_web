<template>
  <footer class="bg-blue-600 text-white">
    <div
      class="max-w-7xl mx-auto px-3 py-3 grid grid-cols-1 md:grid-cols-3 gap-8"
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
          >
            {{ clinic?.phone }}
          </a>
        </p>
        <p class="text-sm opacity-90 flex items-center gap-2">
          <Mail class="w-4 h-4 text-yellow-300" />
          <a
            :href="`mailto:${clinic?.email}`"
            class="hover:text-yellow-300 transition"
          >
            {{ clinic?.email }}
          </a>
        </p>

        <div class="flex gap-4 mt-3">
          <a
            v-for="account in accounts"
            :key="account.id"
            :href="account.url"
            target="_blank"
            class="text-white hover:text-yellow-300 transition"
          >
            <svg
              v-if="account.platform === 'facebook'"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 
        1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 
        1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12Z"
              />
            </svg>

            <svg
              v-else-if="account.platform === 'instagram'"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 
        5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7Zm10 
        2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 
        3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 
        3-3h10Zm-5 3a5 5 0 1 0 0 10 5 5 
        0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 
        3 0 0 1 0-6Zm4.8-.9a1.1 1.1 0 1 
        0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
              />
            </svg>

            <svg
              v-else-if="account.platform === 'telegram'"
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9.9 16.2 9.7 20c.4 0 .6-.2.8-.4l2-2 
        4.1 3c.8.5 1.4.2 1.6-.8l2.9-13.7c.3-1.2-.4-1.7-1.2-1.4L3.6 
        9.2c-1.2.5-1.2 1.2-.2 1.5l4.2 1.3L17.4 6c.5-.3.9-.1.5.2L9.9 
        16.2Z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-3 border-b border-white/20 pb-1">
          Ish vaqti
        </h3>
        <div class="text-sm opacity-90 whitespace-pre-line">
          {{ clinic?.working_hours }}
        </div>
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
import { onMounted } from "vue";
import { useClinicStore } from "@/stores/clinic";
import { useSocialAccountStore } from "@/stores/socialAccount";
import { MapPin, Phone, Mail } from "lucide-vue-next";

const clinicStore = useClinicStore();
clinicStore.getClinic();
const { clinic } = storeToRefs(clinicStore);

const socialStore = useSocialAccountStore();
const { accounts } = storeToRefs(socialStore);
const { getSocialAccounts } = socialStore;

onMounted(() => {
  getSocialAccounts();
});
</script>
