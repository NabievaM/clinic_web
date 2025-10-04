<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
  >
    <div
      class="relative bg-white rounded-2xl p-4 w-full max-w-md shadow-xl transform transition-all duration-300 animate-fadeIn"
    >
      <button
        @click="$emit('update:modelValue', false)"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <div class="flex items-center gap-2 mb-2">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">
          Yangi xizmat qo‘shish
        </h2>
      </div>

      <div
        v-if="formError"
        class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
      >
        ❌ {{ formError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-2">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Xizmat nomi</label>
          <input
            v-model="localForm.name"
            type="text"
            placeholder="Masalan: Terapiya"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Narxi</label>
            <input
              v-model="localForm.price"
              type="text"
              inputmode="numeric"
              placeholder="150000 so‘m"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
              @input="
                (e) => (localForm.price = e.target.value.replace(/[^0-9]/g, ''))
              "
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Davomiyligi</label>
            <input
              v-model="localForm.duration"
              type="text"
              inputmode="numeric"
              placeholder="30 daqiqa"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
              @input="
                (e) =>
                  (localForm.duration = e.target.value.replace(/[^0-9]/g, ''))
              "
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Tavsif</label>
          <textarea
            v-model="localForm.description"
            rows="2"
            placeholder="Xizmat haqida qisqacha izoh..."
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition resize-none"
          ></textarea>
        </div>

        <label class="flex items-center gap-2 cursor-pointer text-sm">
          <input
            v-model="localForm.is_popular"
            type="checkbox"
            class="rounded text-primary focus:ring-primary"
          />
          <span class="text-gray-900">Mashhur xizmat</span>
        </label>

        <div class="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-sm"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow hover:shadow-md hover:scale-105 transition text-sm"
          >
            Saqlash
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  form: {
    type: Object,
    default: () => ({
      name: "",
      price: "",
      duration: "",
      description: "",
      is_popular: false,
    }),
  },
});

const emit = defineEmits(["update:modelValue", "submit"]);
const localForm = ref({ ...props.form });

watch(
  () => props.modelValue,
  (val) => {
    if (val) localForm.value = { ...props.form };
  }
);

const formError = ref("");

async function handleSubmit() {
  formError.value = "";

  if (!localForm.value.name) {
    formError.value = "Xizmat nomi kiritilishi shart!";
    return;
  }

  if (!localForm.value.price) {
    formError.value = "Narx kiritilishi shart!";
    return;
  }

  if (!localForm.value.duration) {
    formError.value = "Davomiylik kiritilishi shart!";
    return;
  }

  emit("submit", localForm.value);
}
</script>
