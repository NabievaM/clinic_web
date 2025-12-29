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

      <div class="flex items-center gap-2 mb-3">
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
          Yangi mutaxassis qo‘shish
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
          <label class="text-sm font-medium text-gray-700"
            >Foydalanuvchi ID</label
          >
          <input
            v-model.number="localForm.user_id"
            type="number"
            placeholder="Masalan: 5"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Lavozimi</label>
            <input
              v-model="localForm.position"
              type="text"
              placeholder="Masalan: Terapevt"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Ixtisosligi</label>
            <input
              v-model="localForm.specialization"
              type="text"
              placeholder="Masalan: Kardiologiya"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700"
              >Ish tajribasi</label
            >
            <input
              v-model="localForm.experience_years"
              type="text"
              placeholder="5 yil"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="localForm.status"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700"
            >Ish kunlari va vaqti</label
          >
          <textarea
            v-model="localForm.working_days"
            placeholder="Dush-Juma 09:00-18:00"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition resize-none"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Tavsif</label>
          <textarea
            v-model="localForm.description"
            rows="2"
            placeholder="Mutaxassis haqida qisqacha izoh..."
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition resize-none"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Rasm yuklash</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />
          <p v-if="fileError" class="text-red-500 text-sm">
            📷 Iltimos, rasm yuklang
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

const props = defineProps({
  modelValue: Boolean,
  form: Object,
});

const emit = defineEmits(["update:modelValue", "submit"]);
const localForm = ref({ ...props.form });
const fileError = ref(false);
const formError = ref("");

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localForm.value = { ...props.form };
      formError.value = "";
      fileError.value = false;
    }
  }
);

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    localForm.value.photo = file;
    fileError.value = false;
  }
}

function handleSubmit() {
  formError.value = "";

  if (!localForm.value.user_id) {
    formError.value = "User Id kiritish majburiy!";
    return;
  }

  if (!localForm.value.photo) {
    fileError.value = true;
    return;
  }

  if (!localForm.value.position) {
    formError.value = "Lavozim kiritish majburiy!";
    return;
  }

  if (!localForm.value.specialization) {
    formError.value = "Ixtisoslik kiritish majburiy!";
    return;
  }

  if (!localForm.value.experience_years) {
    formError.value = "Tajriba yillari ko‘rsatilishi shart!";
    return;
  }

  if (!localForm.value.working_days) {
    formError.value = "Ish kunlari kiritilishi shart!";
    return;
  }

  emit("submit", localForm.value, (error) => {
    formError.value = error;
  });
}
</script>
