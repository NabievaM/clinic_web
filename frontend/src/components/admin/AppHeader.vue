<template>
  <header
    class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm"
  >
    <div class="flex items-center gap-2">
      <button
        class="lg:hidden p-2 rounded-md hover:bg-gray-100"
        @click="$emit('toggleSidebar')"
      >
        <Menu class="w-6 h-6 text-gray-700" />
      </button>

      <div class="flex items-center gap-1">
        <img
          :src="clinicLogo"
          alt="Clinic Logo"
          class="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
        />
        <h1 class="text-lg font-semibold text-gray-800">
          {{ clinicName }}
        </h1>
      </div>
    </div>

    <div class="relative flex items-center">
      <button
        @click="toggleEmail"
        class="flex items-center gap-1 p-1 rounded-full border border-blue-200 bg-blue-50 hover:bg-gray-100 transition lg:p-0 lg:border-0 lg:bg-transparent lg:hover:bg-transparent"
      >
        <User class="w-5 h-5 lg:w-4 lg:h-4 text-primary" />
        <span class="hidden lg:inline text-md font-medium text-primary">
          {{ user?.email }}
        </span>
      </button>

      <div
        v-if="showEmail"
        class="absolute right-0 top-12 bg-gray-50 border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm text-gray-700 lg:hidden whitespace-nowrap"
      >
        {{ user?.email }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/useUserStore";
import { useClinicStore } from "@/stores/clinic";
import { Menu, User } from "lucide-vue-next";

const showEmail = ref(false);
const toggleEmail = () => (showEmail.value = !showEmail.value);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const clinicStore = useClinicStore();
const clinicName = computed(() => clinicStore.clinic?.name || "Klinika");
const clinicLogo = computed(() =>
  clinicStore.clinic?.logo_url
    ? clinicStore.clinic.logo_url.startsWith("http")
      ? clinicStore.clinic.logo_url
      : `http://localhost:3001/uploads/${clinicStore.clinic.logo_url}`
    : "/no-logo.png"
);

onMounted(() => {
  if (!user.value) userStore.getMe();
  if (!clinicStore.clinic) clinicStore.getClinic();
});
</script>
