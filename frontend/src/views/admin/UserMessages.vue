<template>
  <div v-if="store.loading" class="flex items-center gap-2 text-gray-500">
    <svg class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        class="opacity-25"
      />
      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" class="opacity-75" />
    </svg>
    Yuklanmoqda...
  </div>

  <div
    v-if="!store.loading && store.messages.length"
    class="flex items-center gap-2 font-bold text-primary md:hidden mb-4"
  >
    <h2 class="text-xl">Xabarlar</h2>
    <MessageCircle class="w-5 h-6" />
  </div>

  <div
    v-if="!store.loading && store.messages.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200 table-auto text-center">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3">ID</th>
          <th class="px-4 py-3">Ism</th>
          <th class="px-4 py-3">Telefon</th>
          <th class="px-4 py-3">Xabar</th>
          <th class="px-4 py-3">Sana</th>
          <th class="px-4 py-3">Amallar</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="m in sortedMessages"
          :key="m.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ m.id }}</td>
          <td class="px-4 py-3">{{ m.name }}</td>
          <td class="px-4 py-3">{{ formatPhone(m.phone) }}</td>
          <td class="px-4 py-3 max-w-xs truncate text-gray-600">
            {{ m.message }}
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(m.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-center gap-3 items-center">
              <router-link
                :to="`/admin/user-messages/${m.id}`"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Batafsil
              </router-link>

              <button
                @click="openDelete(m)"
                class="flex items-center justify-center w-7 h-7 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!store.loading && store.messages.length"
    class="space-y-4 md:hidden"
  >
    <div
      v-for="m in sortedMessages"
      :key="m.id"
      class="relative bg-white p-4 rounded-xl shadow border border-gray-200"
    >
      <div class="absolute top-3 right-3">
        <button
          @click="openDelete(m)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <h3 class="text-base font-semibold text-primary mb-1">
        {{ m.name }}
      </h3>

      <p class="text-sm text-gray-600">📞 {{ formatPhone(m.phone) }}</p>

      <p class="text-sm text-gray-600 mt-2 line-clamp-2">💬 {{ m.message }}</p>

      <p class="text-xs text-gray-500 mt-2">
        🗓 {{ new Date(m.createdAt).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/user-messages/${m.id}`"
        class="inline-block mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <div
    v-if="!store.loading && !store.messages.length"
    class="text-gray-500 mt-4 text-center"
  >
    Xabarlar topilmadi 🙅‍♂️
  </div>

  <DeleteModal
    :visible="showDelete"
    title="Xabarni o‘chirish"
    message="Ushbu xabarni rostan ham o‘chirmoqchimisiz?"
    @confirm="confirmDelete"
    @cancel="showDelete = false"
  />
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useUserMessageStore } from "@/stores/userMessage";
import { Trash2, MessageCircle } from "lucide-vue-next";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";

const store = useUserMessageStore();
const showDelete = ref(false);
const selected = ref(null);

onMounted(() => {
  store.getMessages();
});

const sortedMessages = computed(() =>
  [...store.messages].sort((a, b) => a.id - b.id)
);

function openDelete(item) {
  selected.value = item;
  showDelete.value = true;
}

async function confirmDelete() {
  if (selected.value) {
    await store.removeMessage(selected.value.id);
    showDelete.value = false;
  }
}

function formatPhone(phone) {
  if (!phone) return "";
  const c = phone.replace(/\D/g, "");
  return c.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
}
</script>
