<template>
  <div class="flex justify-end mb-2">
    <button
      @click="showModal = true"
      class="flex items-center gap-1 p-2 bg-primary text-white font-medium rounded-xl shadow hover:shadow-lg hover:bg-primary/90 transition-all duration-200"
    >
      <Plus class="w-4 h-4" />
      <span>Banner qo‘shish</span>
    </button>
  </div>

  <div v-if="bannerStore.loading" class="flex items-center gap-2 text-gray-500">
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
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    Yuklanmoqda...
  </div>

  <div
    v-if="bannerStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ bannerStore.error }}
  </div>

  <div
    v-if="!bannerStore.loading && bannerStore.banners.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200 text-center">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="th">ID</th>
          <th class="th">Sarlavha</th>
          <th class="th">Qo‘shilgan sana</th>
          <th class="th">Amallar</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="b in paginatedBanners"
          :key="b.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="th font-medium text-gray-700">{{ b.id }}</td>

          <td class="th max-w-[200px]">
            <span class="block truncate" :title="b.title">
              {{ b.title }}
            </span>
          </td>

          <td class="th text-gray-500">
            {{ new Date(b.createdAt).toLocaleDateString("uz-UZ") }}
          </td>

          <td class="th">
            <div class="flex items-center justify-center gap-3">
              <router-link
                :to="`/admin/banner/${b.id}`"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Batafsil
              </router-link>

              <button
                @click="openEditModal(b)"
                class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
              >
                <Edit2 class="w-4 h-4" />
              </button>

              <button
                @click="openDeleteModal(b)"
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
    v-if="!bannerStore.loading && bannerStore.banners.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary">
      <h2 class="text-xl">Bannerlar</h2>
      <Image class="w-5 h-7" />
    </div>

    <div
      v-for="b in paginatedBanners"
      :key="b.id"
      class="relative bg-white p-4 rounded-lg shadow border border-gray-200"
    >
      <div class="absolute top-3 right-3 flex gap-2">
        <button
          @click="openEditModal(b)"
          class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
        >
          <Edit2 class="w-4 h-4" />
        </button>

        <button
          @click="openDeleteModal(b)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <p class="text-sm font-semibold text-gray-800">📌 {{ b.title }}</p>
      <p class="text-xs text-gray-500 mt-1">
        🗓 {{ new Date(b.createdAt).toLocaleDateString("uz-UZ") }}
      </p>

      <router-link
        :to="`/admin/banner/${b.id}`"
        class="mt-3 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Batafsil
      </router-link>
    </div>
  </div>

  <Pagination
    v-if="bannerStore.banners.length > limit"
    :total="bannerStore.banners.length"
    :page="page"
    :limit="limit"
    @update:page="page = $event"
  />

  <div
    v-if="!bannerStore.loading && !bannerStore.banners.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday banner topilmadi 🙅‍♂️
  </div>

  <BannerForm v-model="showModal" :form="form" @submit="submitForm" />

  <EditModal
    :visible="showEdit"
    title="Bannerni tahrirlash"
    :formData="editData"
    :fields="editFields"
    :error="editError"
    @save="confirmEdit"
    @cancel="cancelEdit"
  />

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
import { useBannerStore } from "@/stores/useBannerStore";
import { Image, Plus, Trash2, Edit2 } from "lucide-vue-next";
import BannerForm from "@/components/admin/BannerForm.vue";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import EditModal from "@/components/admin/common/EditModal.vue";
import Pagination from "@/components/common/Pagination.vue";

const bannerStore = useBannerStore();

const showModal = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const deleteBannerData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");
const editData = ref({});
const editError = ref("");

const page = ref(1);
const limit = ref(10);

const form = ref({
  title: "",
  subtitle: "",
  display_order: "",
  image: "",
});

const editFields = [
  { label: "Sarlavha", model: "title", type: "text" },
  { label: "Qo‘shimcha matn", model: "subtitle", type: "text" },
  { label: "Tartib raqami", model: "display_order", type: "number" },
];

onMounted(() => {
  bannerStore.getBanners();
});

watch(
  () => bannerStore.banners.length,
  (len) => {
    const maxPage = Math.ceil(len / limit.value) || 1;
    if (page.value > maxPage) page.value = maxPage;
  }
);

const paginatedBanners = computed(() => {
  const start = (page.value - 1) * limit.value;
  return [...bannerStore.banners]
    .sort((a, b) => a.id - b.id)
    .slice(start, start + limit.value);
});

async function submitForm(data, setError) {
  try {
    await bannerStore.addBanner(data);
    showModal.value = false;
    form.value = { title: "", subtitle: "", display_order: "", image: "" };
    await bannerStore.getBanners();
  } catch (error) {
    if (typeof setError === "function") setError(error.message);
  }
}

function openEditModal(banner) {
  editData.value = { ...banner };
  showEdit.value = true;
}

async function confirmEdit(updated) {
  editError.value = "";
  try {
    await bannerStore.editBanner(updated.id, updated);
    showEdit.value = false;
    await bannerStore.getBanners();
  } catch (e) {
    editError.value = e.message || "Xatolik yuz berdi";
  }
}

function cancelEdit() {
  showEdit.value = false;
}

function openDeleteModal(banner) {
  deleteBannerData.value = banner;
  deleteTitle.value = "Bannerni o‘chirish";
  deleteMessage.value = `#${banner.id} — "${banner.title}" bannerni rostan ham o‘chirmoqchimisiz?`;
  showDelete.value = true;
}

async function confirmDelete() {
  await bannerStore.removeBanner(deleteBannerData.value.id);
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
