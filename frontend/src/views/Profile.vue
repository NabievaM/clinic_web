<template>
  <AppLayout>
    <div class="max-w-md mx-auto py-12 px-6">
      <div
        v-if="user"
        class="bg-white shadow-xl border-t border-gray-100 rounded-2xl p-8"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md"
          >
            {{ user.full_name.charAt(0) }}
          </div>
          <h2 class="mt-4 text-2xl font-semibold text-gray-800">
            {{ user.full_name }}
          </h2>
          <p class="text-sm text-gray-500 tracking-wide">
            {{ user.role }}
          </p>
        </div>

        <div class="mt-8 space-y-4 text-gray-700">
          <div class="flex items-center space-x-3">
            <span class="text-blue-600">📞</span>
            <span class="text-base">{{ user.phone }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-blue-600">✉️</span>
            <span class="text-base">{{ user.email }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-blue-600">🏠</span>
            <span class="text-base">{{
              user.address || "Ko‘rsatilmagan"
            }}</span>
          </div>
        </div>

        <button
          @click="logout"
          class="mt-8 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-xl font-medium shadow-md transition"
        >
          Chiqish
        </button>
      </div>

      <p v-else class="text-center text-gray-500">Ma’lumot topilmadi...</p>
    </div>
  </AppLayout>
</template>

<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import AppLayout from "../layouts/AppLayout.vue";

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(() => {
  userStore.getMe();
});

const { user } = storeToRefs(userStore);

const logout = () => {
  authStore.logout();
};
</script>
