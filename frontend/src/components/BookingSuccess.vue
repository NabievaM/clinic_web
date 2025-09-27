<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]"
  >
    <div
      class="bg-white shadow-xl rounded-2xl p-6 text-center w-80 relative"
      @click.stop
    >
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="emit('close')"
        aria-label="close"
      >
        ✕
      </button>

      <div class="text-blue-600 text-4xl mb-3">📩</div>
      <h2 class="text-gray-600 text-sm">
        Sizning broningiz mutaxassisga yuborildi. Hozircha
        <strong>"kutilmoqda"</strong> holatda, tasdiqlashini kuting.
      </h2>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);
</script>
