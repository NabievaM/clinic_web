<template>
  <div
    v-if="open"
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
          @click="$emit('confirm')"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Ha
        </button>
        <button
          @click="$emit('close')"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow"
        >
          Yo‘q
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ open: { type: Boolean, default: false } });
</script>
