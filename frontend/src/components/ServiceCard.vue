<template>
  <div
    class="bg-white rounded-2xl shadow-md border-t border-gray-100 p-6 hover:shadow-xl transition-shadow flex flex-col"
  >
    <div class="flex items-center mb-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4"
      >
        <i class="fa-solid fa-stethoscope"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">
        {{ service.name }}
      </h3>
    </div>

    <p class="text-gray-600 mb-4 line-clamp-3">
      {{ service.description }}
    </p>

    <div class="mt-auto flex justify-between text-sm text-gray-700 pt-4">
      <span><strong>Narxi:</strong> {{ service.price }} so'm</span>
      <span><strong>Davomiyligi:</strong> {{ service.duration }} min</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  service: {
    type: Object,
    required: true,
  },
});
</script>
