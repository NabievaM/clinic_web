<template>
  <div v-if="socialStore.loading" class="flex items-center gap-2 text-gray-500">
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
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    Yuklanmoqda...
  </div>

  <div
    v-if="socialStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ socialStore.error }}
  </div>

  <div
    v-if="!socialStore.loading && socialStore.accounts.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Platforma</th>
          <th class="px-4 py-3 text-left">Havola</th>
          <th class="px-4 py-3 text-left">Qo‘shilgan sana</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="acc in [...socialStore.accounts].sort((a, b) => a.id - b.id)"
          :key="acc.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ acc.id }}</td>
          <td class="px-4 py-3 capitalize">{{ acc.platform }}</td>
          <td class="px-4 py-3 text-blue-600 underline">
            <a :href="acc.url" target="_blank">{{ acc.url }}</a>
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(acc.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!socialStore.loading && socialStore.accounts.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Ijtimoiy tarmoqlar</h2>
      <Share2 class="w-5 h-7" />
    </div>

    <div
      v-for="acc in [...socialStore.accounts].sort((a, b) => a.id - b.id)"
      :key="acc.id"
      class="bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold capitalize text-gray-800">
          {{ acc.platform }}
        </h3>
      </div>
      <p class="text-sm text-blue-600 underline">
        🔗 <a :href="acc.url" target="_blank">{{ acc.url }}</a>
      </p>
      <p class="text-xs text-gray-500 mt-2">
        🗓 {{ new Date(acc.createdAt).toLocaleDateString("uz-UZ") }}
      </p>
    </div>
  </div>

  <div
    v-if="!socialStore.loading && !socialStore.accounts.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday ijtimoiy tarmoq topilmadi 🙅‍♂️
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useSocialAccountStore } from "@/stores/socialAccount";
import { Share2 } from "lucide-vue-next";

const socialStore = useSocialAccountStore();

onMounted(() => {
  socialStore.getSocialAccounts();
});
</script>
