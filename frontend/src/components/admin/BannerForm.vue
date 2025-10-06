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
        <h2 class="text-lg font-semibold text-gray-800">Banner qo‘shish</h2>
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
            @input="errors.title = ''"
            type="text"
            placeholder="Masalan: Tishlarni bepul tekshiruv aksiyasi!"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            :class="{ 'border-red-400': errors.title }"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">
            {{ errors.title }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">
            Taglavha (ixtiyoriy)
          </label>
          <input
            v-model="localForm.subtitle"
            type="text"
            placeholder="Masalan: Zamonaviy uskunalarda davolanish imkoniyati"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Tartib raqami</label>
          <input
            v-model.number="localForm.display_order"
            @input="errors.display_order = ''"
            type="number"
            placeholder="Masalan: 1"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            :class="{ 'border-red-400': errors.display_order }"
          />
          <p v-if="errors.display_order" class="text-red-500 text-sm mt-1">
            {{ errors.display_order }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Banner rasmi</label>
          <input
            type="file"
            accept="image/*"
            @change="
              (e) => {
                handleFileUpload(e);
                errors.image = '';
              }
            "
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            :class="{ 'border-red-400': errors.image }"
          />
          <p v-if="errors.image" class="text-red-500 text-sm mt-1">
            Banner rasmi tanlanishi kerak!
          </p>

          <div v-if="previewUrl" class="mt-2">
            <img
              :src="previewUrl"
              alt="Preview"
              class="w-full h-40 object-cover rounded-lg border"
            />
          </div>
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
const errors = ref({});
const formError = ref("");
const previewUrl = ref(null);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localForm.value = { ...props.form };
      formError.value = "";
      errors.value = {};
      previewUrl.value = null;
    }
  }
);

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    localForm.value.image = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

function handleSubmit() {
  errors.value = {};
  formError.value = "";

  if (!localForm.value.title)
    errors.value.title = "Sarlavha to‘ldirilishi shart!";
  if (!localForm.value.display_order)
    errors.value.display_order = "Tartib raqami to‘ldirilishi shart!";
  if (!localForm.value.image)
    errors.value.image = "Banner rasmi tanlanishi kerak!";

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  const formData = new FormData();
  Object.entries(localForm.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });

  emit("submit", formData, (error) => {
    formError.value = error;
  });
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
