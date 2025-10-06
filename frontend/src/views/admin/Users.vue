<template>
  <div v-if="userStore.loading" class="flex items-center gap-2 text-gray-500">
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
    v-if="userStore.error"
    class="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg"
  >
    ❌ {{ userStore.error }}
  </div>

  <div
    v-if="!userStore.loading && userStore.users.length"
    class="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th class="px-4 py-3 text-left">ID</th>
          <th class="px-4 py-3 text-left">Ism Familiya</th>
          <th class="px-4 py-3 text-left">Telefon</th>
          <th class="px-4 py-3 text-left">Email</th>
          <th class="px-4 py-3 text-left">Manzil</th>
          <th class="px-4 py-3 text-left">Lavozim</th>
          <th class="px-4 py-3 text-left">Qo‘shilgan sana</th>
          <th class="px-4 py-3 text-right">Amallar</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="u in [...userStore.users].sort((a, b) => a.id - b.id)"
          :key="u.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="px-4 py-3 font-medium text-gray-700">{{ u.id }}</td>
          <td class="px-4 py-3">{{ u.full_name }}</td>
          <td class="px-4 py-3">{{ formatPhone(u.phone) }}</td>
          <td class="px-4 py-3 text-gray-600">{{ u.email }}</td>
          <td class="px-4 py-3 text-gray-600">{{ u.address || "—" }}</td>
          <td class="px-4 py-3">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                u.role === 'admin'
                  ? 'bg-red-100 text-red-600'
                  : u.role === 'specialist'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-green-100 text-green-600',
              ]"
            >
              {{ u.role }}
            </span>
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(u.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3 text-right">
            <button
              @click="openDeleteModal(u)"
              class="flex items-center justify-center w-6 h-6 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition mx-auto"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    v-if="!userStore.loading && userStore.users.length"
    class="space-y-4 md:hidden"
  >
    <div class="flex gap-2 font-bold text-primary mb-2 items-center">
      <Users class="w-5 h-5" />
      <h2 class="text-lg">Foydalanuvchilar ro‘yxati</h2>
    </div>

    <div
      v-for="u in [...userStore.users].sort((a, b) => a.id - b.id)"
      :key="u.id"
      class="relative bg-white p-4 rounded-xl shadow border border-gray-200"
    >
      <button
        @click="openDeleteModal(u)"
        class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500"
      >
        <Trash2 class="w-4 h-4" />
      </button>

      <div class="flex justify-between items-center mb-2 pr-10">
        <h3 class="text-lg font-semibold text-gray-800">{{ u.full_name }}</h3>
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-semibold',
            u.role === 'admin'
              ? 'bg-red-100 text-red-600'
              : u.role === 'specialist'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-green-100 text-green-600',
          ]"
        >
          {{ u.role }}
        </span>
      </div>

      <p class="text-sm text-gray-600">📞 {{ formatPhone(u.phone) }}</p>
      <p class="text-sm text-gray-600">✉️ {{ u.email }}</p>
      <p class="text-sm text-gray-600">📍 {{ u.address || "—" }}</p>
      <p class="text-xs text-gray-500 mt-2">
        🗓 {{ new Date(u.createdAt).toLocaleDateString("uz-UZ") }}
      </p>
    </div>
  </div>

  <div
    v-if="!userStore.loading && !userStore.users.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday foydalanuvchi topilmadi 🙅‍♂️
  </div>

  <DeleteModal
    :visible="showDelete"
    :title="deleteTitle"
    :message="deleteMessage"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { Users, Trash2 } from "lucide-vue-next";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";

const userStore = useUserStore();
const showDelete = ref(false);
const deleteUserData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");

onMounted(() => {
  userStore.getAllUsers();
});

function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.replace(
    /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
    "+$1 ($2) $3-$4-$5"
  );
}

function openDeleteModal(user) {
  deleteUserData.value = user;
  deleteTitle.value = "Foydalanuvchini o‘chirish";
  deleteMessage.value = `${user.full_name} foydalanuvchisini rostan ham o‘chirilsinmi?`;
  showDelete.value = true;
}

async function confirmDelete() {
  const { ok, message } = await userStore.deleteUserById(
    deleteUserData.value.id
  );
  if (!ok) console.error(message);
  showDelete.value = false;
}

function cancelDelete() {
  showDelete.value = false;
}
</script>
