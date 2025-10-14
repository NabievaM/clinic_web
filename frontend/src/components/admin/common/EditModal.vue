<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
  >
    <div
      class="relative bg-white rounded-2xl p-5 w-full max-w-md shadow-xl transform transition-all duration-300 animate-fadeIn sm:mx-4 sm:w-full overflow-hidden"
    >
      <button
        @click="cancel"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Edit class="w-5 h-5" />
        </div>
        <h2 class="text-lg font-semibold text-gray-800">
          {{ title || "Ma’lumotni tahrirlash" }}
        </h2>
      </div>

      <div
        v-if="formError"
        class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
      >
        ❌ {{ formError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4 overflow-visible">
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="space-y-1.5 relative"
        >
          <label class="text-sm font-medium text-gray-700">{{
            field.label
          }}</label>

          <input
            v-if="
              ['text', 'email', 'number'].includes(field.type) &&
              field.model !== 'phone'
            "
            v-model="localForm[field.model]"
            :type="field.type"
            :placeholder="field.placeholder"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-gray-700"
          />

          <input
            v-else-if="field.model === 'phone'"
            v-model="displayPhone"
            type="tel"
            placeholder="+998 (__) ___-__-__"
            maxlength="19"
            @input="formatPhone"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-gray-700"
          />

          <div v-else-if="field.type === 'select'" class="relative">
            <div
              @click="toggleDropdown(field.model)"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 cursor-pointer focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-gray-700 flex justify-between items-center hover:bg-gray-100"
            >
              <span>
                {{
                  localForm[field.model]
                    ? field.options.find(
                        (opt) => opt.value === localForm[field.model]
                      )?.label
                    : "Tanlang..."
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

            <transition name="fade">
              <ul
                v-if="openDropdown === field.model"
                class="w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 mb-3 pb-2 max-h-[200px] overflow-auto"
              >
                <li
                  v-for="option in field.options"
                  :key="option.value"
                  @click="selectOption(field.model, option.value)"
                  class="px-3 py-2 hover:bg-primary/10 cursor-pointer text-gray-700"
                >
                  {{ option.label }}
                </li>
              </ul>
            </transition>
          </div>

          <textarea
            v-else-if="field.type === 'textarea'"
            v-model="localForm[field.model]"
            :placeholder="field.placeholder"
            rows="3"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition text-gray-700"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            @click="cancel"
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
import { Edit } from "lucide-vue-next";

const props = defineProps({
  visible: Boolean,
  title: String,
  formData: Object,
  fields: Array,
  error: String,
});

const emit = defineEmits(["save", "cancel"]);

const localForm = ref({ ...props.formData });
const formError = ref("");
const openDropdown = ref(null);
const displayPhone = ref("");

function formatPhone(e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.startsWith("998")) value = value.slice(3);
  if (value.length > 9) value = value.slice(0, 9);
  let formatted = "+998 ";
  if (value.length > 0) formatted += "(" + value.substring(0, 2);
  if (value.length >= 2) formatted += ") ";
  if (value.length >= 5) {
    formatted += value.substring(2, 5) + "-";
    formatted += value.substring(5, 7);
    if (value.length >= 7) formatted += "-" + value.substring(7, 9);
  } else if (value.length > 2) {
    formatted += value.substring(2, 5);
  }
  displayPhone.value = formatted;
  localForm.value.phone = "998" + value;
}

function toggleDropdown(model) {
  openDropdown.value = openDropdown.value === model ? null : model;
}

function selectOption(model, value) {
  localForm.value[model] = value;
  openDropdown.value = null;
}

function handleClickOutside(e) {
  if (!e.target.closest(".relative")) {
    openDropdown.value = null;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      localForm.value = { ...props.formData };
      formError.value = "";
      openDropdown.value = null;
      if (localForm.value.phone) {
        const digits = localForm.value.phone.replace(/\D/g, "").slice(3);
        let formatted = "+998 ";
        if (digits.length > 0) formatted += "(" + digits.substring(0, 2);
        if (digits.length >= 2) formatted += ") ";
        if (digits.length >= 5) {
          formatted += digits.substring(2, 5) + "-";
          formatted += digits.substring(5, 7);
          if (digits.length >= 7) formatted += "-" + digits.substring(7, 9);
        } else if (digits.length > 2) {
          formatted += digits.substring(2, 5);
        }
        displayPhone.value = formatted;
      }
    }
  }
);

watch(
  () => props.error,
  (val) => {
    formError.value = val || "";
  }
);

function handleSubmit() {
  emit("save", { ...localForm.value });
}

function cancel() {
  emit("cancel");
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
