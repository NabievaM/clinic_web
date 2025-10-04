<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 shadow-xl flex flex-col transform transition-all duration-300 ease-in-out h-screen overflow-y-auto rounded-r-2xl custom-scrollbar',
      open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0',
      'lg:translate-x-0 lg:opacity-100 lg:static',
    ]"
  >
    <div class="p-3 text-2xl font-bold text-primary border-b border-gray-200">
      Admin paneli
    </div>

    <nav class="flex-1 p-2 flex flex-col">
      <div class="space-y-2">
        <router-link
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition"
          active-class="bg-primary/10 text-primary"
          @click="handleNavClick"
        >
          <component :is="icons[item.icon]" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>

      <div class="mt-auto pt-4">
        <button
          @click="onLogout"
          class="flex items-center gap-3 w-full px-4 text-left rounded-lg font-medium bg-red-100 p-2 text-red-600 hover:bg-red-50 transition"
        >
          <LogOut class="w-5 h-5" />
          Chiqish
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import navItems from "@/data/navItems";
import * as LucideIcons from "lucide-vue-next";
import { LogOut } from "lucide-vue-next";

const props = defineProps({
  open: { type: Boolean, default: false },
});
const emit = defineEmits(["close", "logout"]);

const items = navItems;
const icons = {
  LayoutDashboard: LucideIcons.LayoutDashboard,
  Users: LucideIcons.Users,
  Stethoscope: LucideIcons.Stethoscope,
  FileText: LucideIcons.FileText,
  BarChart: LucideIcons.BarChart2 || LucideIcons.BarChart,
  TestTube: LucideIcons.TestTube,
  Image: LucideIcons.Image,
  Award: LucideIcons.Award,
  Building2: LucideIcons.Building2,
  Share2: LucideIcons.Share2,
};

function handleNavClick() {
  emit("close");
}
function onLogout() {
  emit("logout");
}

</script>
