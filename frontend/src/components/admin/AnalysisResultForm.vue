<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
  >
    <div
      class="relative bg-white rounded-2xl p-4 w-full max-w-md shadow-xl animate-fadeIn"
    >
      <button
        @click="$emit('update:modelValue', false)"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        Yangi tahlil natijasi qo‘shish
      </h2>

      <div
        v-if="formError"
        class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
      >
        ❌ {{ formError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div>
          <label class="text-sm font-medium">Booking ID</label>
          <input
            v-model.number="localForm.booking_id"
            type="number"
            placeholder="Masalan: 7"
            class="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary"
          />
          <p v-if="fieldErrors.booking_id" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.booking_id }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium">Tavsif</label>
          <textarea
            v-model="localForm.description"
            rows="2"
            placeholder="Natija haqida qisqacha"
            class="w-full border rounded-lg px-3 py-2 bg-gray-50 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="text-sm font-medium">PDF fayl</label>
          <input
            type="file"
            accept="application/pdf"
            @change="handleFileUpload"
            class="w-full border rounded-lg px-3 py-2 bg-gray-50"
          />
          <p v-if="fieldErrors.file_url" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.file_url }}
          </p>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-primary text-white font-medium"
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
  form: Object,
});

const emit = defineEmits(["update:modelValue", "submit"]);

const localForm = ref({ ...props.form });
const formError = ref("");
const fieldErrors = ref({
  booking_id: "",
  file_url: "",
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localForm.value = { ...props.form };
      formError.value = "";
      fieldErrors.value = { booking_id: "", file_url: "" };
    }
  }
);

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    localForm.value.file_url = file;
    fieldErrors.value.file_url = "";
  }
}

function handleSubmit() {
  formError.value = "";
  fieldErrors.value = { booking_id: "", file_url: "" };

  let hasError = false;

  if (!localForm.value.booking_id) {
    fieldErrors.value.booking_id = "Booking ID kiritish majburiy!";
    hasError = true;
  }

  if (!localForm.value.file_url) {
    fieldErrors.value.file_url = "📄 Iltimos, PDF fayl yuklang!";
    hasError = true;
  }

  if (hasError) return;

  const formData = new FormData();
  Object.keys(localForm.value).forEach((key) => {
    let value = localForm.value[key];
    if (key === "booking_id" && value !== undefined && value !== null) {
      value = parseInt(value);
    }
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  emit("submit", formData, (error) => {
    formError.value = error;
  });
}
</script>
