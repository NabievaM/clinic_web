<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3 overflow-y-auto"
  >
    <div
      class="relative bg-white rounded-2xl p-5 w-full max-w-md shadow-xl transform transition-all duration-300 animate-fadeIn overflow-y-auto max-h-[90vh] sm:mx-4 sm:w-full"
    >
      <button
        @click="$emit('update:modelValue', false)"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Plus class="w-4 h-4" />
        </div>
        <h2 class="text-lg font-semibold text-gray-800">
          Ijtimoiy tarmoq qo‘shish
        </h2>
      </div>

      <div
        v-if="formError"
        class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
      >
        ❌ {{ formError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1.5 relative">
          <label class="text-sm font-medium text-gray-700">Platforma</label>
          <div class="relative">
            <div
              @click="toggleDropdown"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 cursor-pointer focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-gray-700 flex justify-between items-center"
            >
              <span>
                {{
                  localForm.platform
                    ? platforms.find((p) => p.value === localForm.platform)
                        ?.label
                    : "Platformani tanlang"
                }}
              </span>
              <svg
                class="w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <ul
              v-if="dropdownOpen"
              class="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50"
            >
              <li
                v-for="item in platforms"
                :key="item.value"
                @click="selectPlatform(item.value)"
                class="px-3 py-2 hover:bg-primary/10 cursor-pointer text-gray-700"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
          <p v-if="fieldErrors.platform" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.platform }}
          </p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">Havola</label>
          <input
            v-model="localForm.url"
            type="text"
            placeholder="Masalan: https://facebook.com/clinic"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-gray-700"
            :class="{ 'border-red-400': fieldErrors.url }"
            @input="clearError('url')"
          />
          <p v-if="fieldErrors.url" class="text-red-500 text-sm mt-1">
            {{ fieldErrors.url }}
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
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { Plus } from "lucide-vue-next";

const props = defineProps({
  modelValue: Boolean,
  form: Object,
});
const emit = defineEmits(["update:modelValue", "submit"]);

const localForm = ref({ ...props.form });
const formError = ref("");
const fieldErrors = ref({ platform: "", url: "" });
const dropdownOpen = ref(false);

const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "google_business", label: "Google Business" },
];

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectPlatform(value) {
  localForm.value.platform = value;
  dropdownOpen.value = false;
  clearError("platform");
}

function clearError(field) {
  fieldErrors.value[field] = "";
}

function handleClickOutside(e) {
  if (!e.target.closest(".relative")) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localForm.value = { ...props.form };
      formError.value = "";
      fieldErrors.value = { platform: "", url: "" };
      dropdownOpen.value = false;
    }
  }
);

function handleSubmit() {
  formError.value = "";
  fieldErrors.value = { platform: "", url: "" };
  let hasError = false;
  if (!localForm.value.platform) {
    fieldErrors.value.platform = "Platforma tanlash majburiy!";
    hasError = true;
  }
  if (!localForm.value.url) {
    fieldErrors.value.url = "📄 Havola kiritish majburiy!";
    hasError = true;
  }
  if (hasError) return;
  emit("submit", { ...localForm.value }, (error) => {
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
