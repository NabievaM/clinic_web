<template>
  <div class="flex justify-end mb-2">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Ijtimoiy tarmoq qo‘shish</span>
    </button>
  </div>

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
    v-if="!socialStore.loading && socialStore.accounts.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="th text-left">ID</th>
          <th class="th text-left">Platforma</th>
          <th class="th text-left">Havola</th>
          <th class="th text-left">Qo‘shilgan sana</th>
          <th class="th text-center">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="acc in paginatedAccounts"
          :key="acc.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="th font-medium text-gray-700">{{ acc.id }}</td>
          <td class="th capitalize">{{ acc.platform }}</td>
          <td class="th text-blue-600 underline max-w-[200px]">
            <a
              class="block truncate"
              :title="acc.url"
              :href="acc.url"
              target="_blank"
            >
              {{ acc.url }}
            </a>
          </td>
          <td class="th text-gray-500">
            {{ new Date(acc.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="th text-right">
            <button
              @click="openDeleteModal(acc)"
              class="flex items-center justify-center w-7 h-7 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition mx-auto"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!socialStore.loading && socialStore.accounts.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary items-center">
      <h2 class="text-xl">Ijtimoiy tarmoqlar</h2>
      <Share2 class="w-5 h-7" />
    </div>

    <div
      v-for="acc in paginatedAccounts"
      :key="acc.id"
      class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <button
        @click="openDeleteModal(acc)"
        class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500"
      >
        <Trash2 class="w-4 h-4" />
      </button>

      <div class="flex justify-between items-center mb-2 pr-10">
        <h3 class="text-lg font-semibold capitalize text-gray-800">
          {{ acc.platform }}
        </h3>
      </div>

      <p class="text-sm text-blue-600 underline break-all">
        🔗 <a :href="acc.url" target="_blank">{{ acc.url }}</a>
      </p>

      <p class="text-xs text-gray-500 mt-2">
        🗓 {{ new Date(acc.createdAt).toLocaleDateString("uz-UZ") }}
      </p>
    </div>
  </div>

  <Pagination
    v-if="socialStore.accounts.length > limit"
    :total="socialStore.accounts.length"
    :page="page"
    :limit="limit"
    @update:page="page = $event"
  />

  <div
    v-if="!socialStore.loading && !socialStore.accounts.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday ijtimoiy tarmoq topilmadi 🙅‍♂️
  </div>

  <SocialAccountForm v-model="showModal" :form="form" @submit="submitForm" />

  <DeleteModal
    :visible="showDelete"
    :title="deleteTitle"
    :message="deleteMessage"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useSocialAccountStore } from "@/stores/socialAccount";
import { Share2, Plus, Trash2 } from "lucide-vue-next";
import SocialAccountForm from "@/components/admin/SocialAccountForm.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const socialStore = useSocialAccountStore();

const showModal = ref(false);
const showDelete = ref(false);
const deleteAccountData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");

const page = ref(1);
const limit = ref(10);

const form = ref({
  platform: "",
  url: "",
});

onMounted(() => {
  socialStore.getSocialAccounts();
});

watch(
  () => socialStore.accounts.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

const paginatedAccounts = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...socialStore.accounts]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

async function submitForm(data, setError) {
  try {
    await socialStore.addSocialAccount(data);
    showModal.value = false;
    form.value = { platform: "", url: "" };
    await socialStore.getSocialAccounts();
  } catch (error) {
    if (typeof setError === "function") {
      setError(error.message);
    }
  }
}

function openDeleteModal(acc) {
  deleteAccountData.value = acc;
  deleteTitle.value = "Ijtimoiy tarmoqni o‘chirish";
  deleteMessage.value = `${acc.platform} ijtimoiy tarmog‘i rostan ham o‘chirilsinmi?`;
  showDelete.value = true;
}

async function confirmDelete() {
  const { success, message } = await socialStore.removeSocialAccount(
    deleteAccountData.value.id
  );
  if (!success) console.error(message);
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
