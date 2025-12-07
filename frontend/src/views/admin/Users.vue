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
          <th class="px-4 py-3 text-center">Amallar</th>
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
              {{ u.role || "—" }}
            </span>
          </td>
          <td class="px-4 py-3 text-gray-500">
            {{ new Date(u.createdAt).toLocaleDateString("uz-UZ") }}
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-center gap-2">
              <button
                @click="openEditModal(u)"
                class="flex items-center justify-center w-7 h-7 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
              >
                <Edit2 class="w-4 h-4" />
              </button>
              <button
                @click="openDeleteModal(u)"
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
      <div class="absolute top-3 right-3 flex flex-row items-center gap-2">
        <button
          @click="openEditModal(u)"
          class="flex items-center justify-center w-8 h-8 border border-blue-200 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="openDeleteModal(u)"
          class="flex items-center justify-center w-8 h-8 border border-red-200 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>

      <div class="pr-12">
        <h3 class="text-lg font-semibold text-gray-800">{{ u.full_name }}</h3>

        <div class="flex items-center gap-2 mt-1">
          <span
            class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
          >
            ID: {{ u.id }}
          </span>

          <span
            :class="[
              'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
              u.role === 'admin'
                ? 'bg-red-100 text-red-600'
                : u.role === 'specialist'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-green-100 text-green-600',
            ]"
          >
            {{ u.role || "—" }}
          </span>
        </div>

        <p class="text-sm text-gray-600 mt-2">📞 {{ formatPhone(u.phone) }}</p>
        <p class="text-sm text-gray-600">✉️ {{ u.email }}</p>
        <p class="text-sm text-gray-600">📍 {{ u.address || "—" }}</p>
        <p class="text-xs text-gray-500 mt-2">
          🗓 {{ new Date(u.createdAt).toLocaleDateString("uz-UZ") }}
        </p>
      </div>
    </div>
  </div>

  <div
    v-if="!userStore.loading && !userStore.users.length"
    class="text-gray-500 mt-4 text-center"
  >
    Hech qanday foydalanuvchi topilmadi 🙅‍♂️
  </div>

  <EditModal
    :visible="showEdit"
    :title="'Foydalanuvchini tahrirlash'"
    :formData="editUserData"
    :fields="editFields"
    :error="editFormError"
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
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { Users, Trash2, Edit2 } from "lucide-vue-next";
import DeleteModal from "@/components/admin/common/DeleteModal.vue";
import EditModal from "@/components/admin/common/EditModal.vue";

const userStore = useUserStore();

const showDelete = ref(false);
const deleteUserData = ref(null);
const deleteTitle = ref("");
const deleteMessage = ref("");
const showEdit = ref(false);
const editUserData = ref({});
const editFormError = ref("");

const editFields = [
  {
    label: "Ism Familiya",
    model: "full_name",
    type: "text",
    placeholder: "Ali Karimov",
  },
  {
    label: "Telefon raqam",
    model: "phone",
    type: "text",
    placeholder: "+998...",
  },
  {
    label: "Email",
    model: "email",
    type: "email",
    placeholder: "example@gmail.com",
  },
  { label: "Manzil", model: "address", type: "text", placeholder: "Toshkent" },
  {
    label: "Lavozim",
    model: "role",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "specialist", label: "Mutaxassis" },
      { value: "patient", label: "Bemor" },
    ],
  },
];

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

function openEditModal(user) {
  editUserData.value = { ...user };
  showEdit.value = true;
}

async function confirmEdit(updatedUser) {
  editFormError.value = "";

  const { ok, message } = await userStore.updateUserById(
    updatedUser.id,
    updatedUser
  );

  if (!ok) {
    editFormError.value = message;
  } else {
    showEdit.value = false;
    await userStore.getAllUsers();
  }
}

function cancelEdit() {
  showEdit.value = false;
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
