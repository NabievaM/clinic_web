<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
  >
    <div
      class="relative bg-white rounded-2xl p-4 w-full max-w-md shadow-xl transform transition-all duration-300 animate-fadeIn"
    >
      <button
        @click="cancel"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <div class="flex items-center gap-2 mb-3">
        <div
          class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary"
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

      <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">
        <div
          v-for="(field, index) in fields"
          :key="index"
          :class="[
            'space-y-1.5 relative',
            field.colSpan === 2 ? 'col-span-2' : 'col-span-1',
          ]"
        >
          <label class="text-sm font-medium text-gray-700">
            {{ field.label }}
          </label>

          <input
            v-if="['text', 'email', 'number'].includes(field.type)"
            v-model="localForm[field.model]"
            :type="field.type"
            :placeholder="field.placeholder"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />

          <input
            v-else-if="field.type === 'file'"
            type="file"
            accept="field.accept"   
            @change="onFileChange($event, field.model)"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />

          <div v-else-if="field.type === 'select'" class="relative">
            <div
              @click="toggleDropdown(field.model)"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 cursor-pointer flex justify-between items-center hover:bg-gray-100"
            >
              <span>
                {{
                  field.options.find(
                    (opt) => opt.value === localForm[field.model]
                  )?.label || "Tanlang..."
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
                class="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-[180px] overflow-auto"
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
            rows="2"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition resize-none"
          ></textarea>
        </div>

        <div class="col-span-2 flex justify-end gap-2 pt-4 border-t">
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

function toggleDropdown(model) {
  openDropdown.value = openDropdown.value === model ? null : model;
}

function selectOption(model, value) {
  localForm.value[model] = value;
  openDropdown.value = null;
}

function handleClickOutside(e) {
  if (!e.target.closest(".relative")) openDropdown.value = null;
}

function onFileChange(e, model) {
  const file = e.target.files[0];
  if (file) {
    localForm.value[model] = file;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);

watch(
  () => props.visible,
  (val) => {
    if (val) {
      localForm.value = { ...props.formData };
      formError.value = "";
      openDropdown.value = null;
    }
  }
);

watch(
  () => props.error,
  (val) => (formError.value = val || "")
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
