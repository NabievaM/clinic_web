<template>
  <div v-if="total > limit" class="flex justify-center mt-3">
    <div
      class="inline-flex items-center gap-1 bg-white rounded-lg shadow border border-gray-200 px-2 py-1"
    >
      <button
        @click="change(page - 1)"
        :disabled="page === 1"
        class="px-2 py-1 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-40 transition"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <button
        v-for="p in pages"
        :key="p"
        @click="change(p)"
        class="px-3 py-1 rounded text-sm font-medium transition"
        :class="
          p === page
            ? 'bg-primary text-white shadow'
            : 'text-gray-700 hover:bg-gray-100'
        "
      >
        {{ p }}
      </button>

      <button
        @click="change(page + 1)"
        :disabled="page === pages"
        class="px-2 py-1 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-40 transition"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  total: Number,
  page: Number,
  limit: { type: Number, default: 10 },
});

const emit = defineEmits(["update:page"]);

const pages = computed(() => Math.ceil(props.total / props.limit));

function change(p) {
  if (p >= 1 && p <= pages.value) {
    emit("update:page", p);
  }
}
</script>
