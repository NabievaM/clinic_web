<template>
  <div>
    <router-link
      to="/admin/user-messages"
      class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 hover:shadow transition-all text-sm font-medium"
    >
      ⬅️ Ortga
    </router-link>

    <div v-if="loading" class="flex items-center gap-2 text-gray-500">
      <svg
        class="animate-spin h-5 w-5 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      Yuklanmoqda...
    </div>

    <div
      v-if="error"
      class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
    >
      ❌ {{ error }}
    </div>

    <div v-if="message" class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 class="text-xl font-semibold text-blue-600">
              {{ message.name }}
            </h1>
            <p class="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar class="w-4 h-4 text-blue-500" />
              {{ new Date(message.createdAt).toLocaleString("uz-UZ") }}
            </p>
          </div>

          <span
            class="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium"
          >
            <Phone class="w-4 h-4 text-red-500" />
            {{ formatPhone(message.phone) || "kiritilmagan" }}
          </span>
        </div>

        <div class="h-px w-full bg-gray-100 my-6"></div>

        <div>
          <h3
            class="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide"
          >
            Xabar matni
          </h3>

          <div
            class="relative bg-gray-50 rounded-xl p-5 text-gray-800 leading-relaxed whitespace-pre-line"
          >
            {{ message.message }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && !message"
      class="text-gray-500 mt-4 text-center"
    >
      Ma'lumot topilmadi 🙅‍♂️
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserMessageStore } from "@/stores/userMessage";
import { storeToRefs } from "pinia";
import { Phone, Calendar } from "lucide-vue-next";

const route = useRoute();
const store = useUserMessageStore();
const { message, loading, error } = storeToRefs(store);

onMounted(() => {
  store.getMessage(route.params.id);
});

function formatPhone(phone) {
  if (!phone) return "";
  const c = phone.replace(/\D/g, "");
  return c.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
}
</script>
