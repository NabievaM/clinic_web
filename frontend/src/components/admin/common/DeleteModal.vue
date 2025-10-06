<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
  >
    <div
      class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm sm:max-w-md animate-fadeIn"
    >
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        {{ title || "O‘chirishni tasdiqlaysizmi?" }}
      </h2>
      <p class="text-gray-600 mb-5">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button
          @click="cancel"
          class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          Bekor qilish
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
        >
          Ha, o‘chirish
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: String,
  message: String,
});

const emits = defineEmits(["confirm", "cancel"]);

function confirmDelete() {
  emits("confirm");
}
function cancel() {
  emits("cancel");
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
