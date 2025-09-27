<template>
  <div class="flex h-screen bg-gray-50">
    <aside
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transform transition-transform duration-300 z-40',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static',
      ]"
    >
      <div class="p-3 text-2xl font-bold text-primary border-b border-gray-200">
        Admin paneli
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <LayoutDashboard class="w-5 h-5" />
          Boshqaruv paneli
        </router-link>

        <router-link
          to="/admin/users"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <Users class="w-5 h-5" />
          Foydalanuvchilar
        </router-link>

        <router-link
          to="/admin/services"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <Stethoscope class="w-5 h-5" />
          Xizmatlar
        </router-link>

        <router-link
          to="/admin/statistics"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <BarChart class="w-5 h-5" />
          Statistika
        </router-link>

        <router-link
          to="/admin/banners"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <Image class="w-5 h-5" />
          Bannerlar
        </router-link>

        <router-link
          to="/admin/achievements"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <Award class="w-5 h-5" />
          Yutuqlar
        </router-link>

        <router-link
          to="/admin/socials"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="closeSidebar"
        >
          <Share2 class="w-5 h-5" />
          Ijtimoiy tarmoqlar
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-200">
        <button
          class="flex items-center gap-3 w-full px-4 py-2 text-left rounded-lg font-medium text-red-600 hover:bg-red-50 transition"
          @click="isLogoutConfirmOpen = true"
        >
          <LogOut class="w-5 h-5" />
          Chiqish
        </button>
      </div>
    </aside>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <div class="flex-1 flex flex-col">
      <header
        class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm"
      >
        <div class="flex items-center gap-2">
          <button
            class="lg:hidden p-2 rounded-md hover:bg-gray-100"
            @click="sidebarOpen = !sidebarOpen"
          >
            <Menu class="w-6 h-6 text-gray-700" />
          </button>
          <h1 class="text-lg font-semibold text-gray-700">Admin paneli</h1>
        </div>

        <div class="flex items-center gap-4">
          <button class="p-2 rounded-md hover:bg-gray-100">
            <Bell class="w-5 h-5 text-gray-600" />
          </button>
          <div class="flex items-center gap-2">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=007DC5&color=fff"
              alt="avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <router-view />
      </main>
    </div>

    <transition name="fade">
      <div
        v-if="isLogoutConfirmOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div
          class="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Haqiqatan chiqmoqchimisiz?
          </h3>
          <div class="flex justify-center space-x-4">
            <button
              @click="confirmLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
            >
              Ha
            </button>
            <button
              @click="isLogoutConfirmOpen = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow"
            >
              Yo‘q
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import {
  Menu,
  LayoutDashboard,
  Users,
  Bell,
  LogOut,
  BarChart,
  Image,
  Award,
  FileText,
  Share2,
  Stethoscope,
} from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();

const sidebarOpen = ref(false);
const isLogoutConfirmOpen = ref(false);

function confirmLogout() {
  auth.logout();
  router.push("/login");
  isLogoutConfirmOpen.value = false;
}

function closeSidebar() {
  sidebarOpen.value = false;
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
