<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
  >
    <div
      class="relative bg-white rounded-2xl p-5 w-full max-w-md shadow-xl transform transition-all duration-300 animate-fadeIn"
    >
      <button
        @click="$emit('update:modelValue', false)"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <div class="flex items-center gap-2 mb-3">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Plus class="w-5 h-5" />
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Yutuq qo‘shish</h2>
      </div>

      <div
        v-if="formError"
        class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
      >
        ❌ {{ formError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Sarlavha</label>
          <input
            v-model="localForm.title"
            type="text"
            placeholder="Masalan: Eng yaxshi klinika 2024"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            :class="{ 'border-red-400': fieldErrors.title }"
            @input="clearError('title')"
          />
          <p v-if="fieldErrors.title" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.title }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Tavsif</label>
          <textarea
            v-model="localForm.description"
            rows="2"
            placeholder="Yutuq haqida qisqacha"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none transition"
            :class="{ 'border-red-400': fieldErrors.description }"
            @input="clearError('description')"
          ></textarea>
          <p v-if="fieldErrors.description" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.description }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Sana</label>
          <input
            v-model="localForm.achieved_date"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            :class="{ 'border-red-400': fieldErrors.achieved_date }"
            @input="clearError('achieved_date')"
          />
          <p v-if="fieldErrors.achieved_date" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.achieved_date }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Rasm</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            :class="{ 'border-red-400': fieldErrors.image }"
          />
          <p v-if="fieldErrors.image" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.image }}
          </p>
        </div>

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
import { Plus } from "lucide-vue-next";

const props = defineProps({
  modelValue: Boolean,
  form: Object,
});

const emit = defineEmits(["update:modelValue", "submit"]);

const localForm = ref({ ...props.form });
const formError = ref("");
const fieldErrors = ref({
  title: "",
  description: "",
  achieved_date: "",
  image: "",
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localForm.value = { ...props.form };
      formError.value = "";
      fieldErrors.value = {
        title: "",
        description: "",
        achieved_date: "",
        image: "",
      };
    }
  }
);

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    localForm.value.image = file;
    fieldErrors.value.image = "";
  }
}

function clearError(field) {
  fieldErrors.value[field] = "";
}

function handleSubmit() {
  formError.value = "";
  fieldErrors.value = {
    title: "",
    description: "",
    achieved_date: "",
    image: "",
  };

  let hasError = false;
  if (!localForm.value.title) {
    fieldErrors.value.title = "Sarlavha maydoni bo‘sh bo‘lishi mumkin emas!";
    hasError = true;
  }
  if (!localForm.value.description) {
    fieldErrors.value.description =
      "Tavsif maydoni bo‘sh bo‘lishi mumkin emas!";
    hasError = true;
  }
  if (!localForm.value.achieved_date) {
    fieldErrors.value.achieved_date = "Sana to‘ldirilishi shart!";
    hasError = true;
  }
  if (!localForm.value.image) {
    fieldErrors.value.image = "Rasm yuklang!";
    hasError = true;
  }

  if (hasError) return;

  const formData = new FormData();
  Object.entries(localForm.value).forEach(([key, value]) =>
    formData.append(key, value)
  );

  emit("submit", formData, (err) => (formError.value = err));
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
