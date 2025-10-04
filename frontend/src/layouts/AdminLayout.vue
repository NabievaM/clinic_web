<template>
  <div class="flex h-full bg-gray-50">
    <Sidebar
      :open="sidebarOpen"
      @close="closeSidebar"
      @logout="openLogout"
      class="z-40"
    />

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <div class="flex-1 flex flex-col">
      <AppHeader @toggleSidebar="toggleSidebar" />

      <main class="flex-1 p-4 lg:px-6 lg:py-2 overflow-auto">
        <router-view />
      </main>
    </div>

    <transition name="fade">
      <LogoutConfirm
        :open="isLogoutConfirmOpen"
        @close="isLogoutConfirmOpen = false"
        @confirm="confirmLogout"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Sidebar from "@/components/admin/Sidebar.vue";
import AppHeader from "@/components/admin/AppHeader.vue";
import LogoutConfirm from "@/components/admin/LogoutConfirm.vue";

const auth = useAuthStore();
const router = useRouter();

const sidebarOpen = ref(false);
const isLogoutConfirmOpen = ref(false);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
function closeSidebar() {
  sidebarOpen.value = false;
}
function openLogout() {
  isLogoutConfirmOpen.value = true;
}
function confirmLogout() {
  auth.logout();
  router.push("/login");
  isLogoutConfirmOpen.value = false;
}
</script>
