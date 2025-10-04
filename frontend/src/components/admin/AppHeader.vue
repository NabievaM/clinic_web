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
      <h1 class="text-lg font-semibold text-gray-700">Admin paneli</h1>
    </div>

    <div class="flex items-center gap-4">
      <button
        class="p-2 rounded-md hover:bg-gray-100"
        aria-label="Notifications"
      >
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
</template>

<script setup>
import { Bell, Menu } from "lucide-vue-next";
</script>
