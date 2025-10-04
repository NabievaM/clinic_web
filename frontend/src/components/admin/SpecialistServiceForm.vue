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
          <Plus class="w-5 h-5" />
        </div>
        <h2 class="text-lg font-semibold text-gray-800">
          Mutaxassisga xizmat qo‘shish
        </h2>
      </div>

      <div
        v-if="error"
        class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
      >
        ❌ {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div>
          <label class="text-sm font-medium text-gray-700">Mutaxassis ID</label>
          <input
            v-model.number="localForm.specialist_id"
            type="number"
            placeholder="Masalan: 1"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Xizmat ID</label>
          <input
            v-model.number="localForm.service_id"
            type="number"
            placeholder="Masalan: 3"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition"
          />
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
  form: {
    type: Object,
    default: () => ({ specialist_id: "", service_id: "" }),
  },
  error: {
    type: String,
    default: "",
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

function handleSubmit() {
  if (!localForm.value.specialist_id) {
    emit("submit", {
      ...localForm.value,
      _validationError: "Mutaxassis ID kiritilishi shart!",
    });
    return;
  }
  if (!localForm.value.service_id) {
    emit("submit", {
      ...localForm.value,
      _validationError: "Xizmat ID kiritilishi shart!",
    });
    return;
  }
  emit("submit", localForm.value);
}
</script>
