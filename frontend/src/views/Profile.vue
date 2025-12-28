<template>
  <AppLayout>
    <div class="max-w-md mx-auto py-12 px-4">
      <div
        v-if="user"
        class="bg-white shadow-xl rounded-2xl p-6 text-center relative"
      >
        <div
          class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md mx-auto"
        >
          {{ user.full_name.charAt(0) }}
        </div>

        <h2 class="mt-4 text-2xl font-bold text-gray-800">
          {{ user.full_name }}
        </h2>
        <p class="text-sm text-gray-500">{{ user.role }}</p>

        <div class="mt-6 space-y-3 text-gray-700 text-left">
          <div class="flex items-center space-x-3">
            <Phone class="w-5 h-5 text-green-500" />
            <span>{{ formattedPhone }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <Mail class="w-5 h-5 text-red-500" />
            <span class="break-all">{{ user.email }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <MapPin class="w-5 h-5 text-blue-500" />
            <span>{{ user.address || "Ko‘rsatilmagan" }}</span>
          </div>
        </div>

        <div class="mt-8 space-y-3">
          <button
            @click="isModalOpen = true"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2.5 rounded-xl font-medium shadow-md transition"
          >
            Ma’lumotlarni o‘zgartirish
          </button>
          <button
            @click="isLogoutConfirmOpen = true"
            class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-xl font-medium shadow-md transition"
          >
            Chiqish
          </button>
        </div>
      </div>

      <p v-else class="text-center text-gray-500">Ma’lumot topilmadi...</p>
    </div>

    <transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div
          class="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative"
        >
          <button
            @click="isModalOpen = false"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>

          <h3 class="text-xl font-semibold mb-6 text-center text-gray-800">
            Profilni o‘zgartirish
          </h3>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <input
                v-model="form.full_name"
                type="text"
                placeholder="Ism Familiya"
                class="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <input
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <input
                v-imask="phoneMask"
                :value="form.phone"
                @accept="onPhoneAccept"
                placeholder="+998 (__) ___-__-__"
                class="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div class="relative">
              <input
                v-model="form.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Eski parol"
                class="w-full border rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <svg
                  v-if="showCurrentPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 
                       0 8.268 2.943 9.542 7-1.274 4.057-5.064 
                       7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 
                       19c-4.478 0-8.268-2.943-9.542-7a9.956 
                       9.956 0 012.223-3.592M6.223 6.223A9.956 
                       9.956 0 0112 5c4.477 0 8.268 2.943 
                       9.542 7a9.956 9.956 0 01-4.132 5.411M15 
                       12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3l18 18"
                  />
                </svg>
              </button>
            </div>

            <div class="relative">
              <input
                v-model="form.password"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Yangi parol"
                class="w-full border rounded-xl px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <svg
                  v-if="showNewPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 
                       0 8.268 2.943 9.542 7-1.274 4.057-5.064 
                       7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 
                       19c-4.478 0-8.268-2.943-9.542-7a9.956 
                       9.956 0 012.223-3.592M6.223 6.223A9.956 
                       9.956 0 0112 5c4.477 0 8.268 2.943 
                       9.542 7a9.956 9.956 0 01-4.132 5.411M15 
                       12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3l18 18"
                  />
                </svg>
              </button>
            </div>

            <div>
              <input
                v-model="form.address"
                type="text"
                placeholder="Manzil"
                class="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <p v-if="userStore.error" class="text-red-500 text-sm">
              {{ userStore.error }}
            </p>

            <button
              type="submit"
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 rounded-xl font-medium shadow-md transition"
            >
              Saqlash
            </button>
          </form>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="isLogoutConfirmOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div
          class="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Haqiqatan chiqmoqchimisiz?
          </h3>
          <div class="flex justify-center space-x-4">
            <button
              @click="confirmLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
            >
              Ha
            </button>
            <button
              @click="isLogoutConfirmOpen = false"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow"
            >
              Yo‘q
            </button>
          </div>
        </div>
      </div>
    </transition>
  </AppLayout>
</template>

<script setup>
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, ref, computed } from "vue";
import AppLayout from "../layouts/AppLayout.vue";
import { Phone, Mail, MapPin } from "lucide-vue-next";

const userStore = useUserStore();
const authStore = useAuthStore();
const { user } = storeToRefs(userStore);

const isModalOpen = ref(false);
const isLogoutConfirmOpen = ref(false);

const form = ref({
  full_name: "",
  email: "",
  currentPassword: "",
  password: "",
  address: "",
  phone: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

const phoneMask = {
  mask: "+{998} (00) 000-00-00",
  lazy: false,
};

const onPhoneAccept = (e) => {
  form.value.phone = e.detail.value;
};

const formattedPhone = computed(() => {
  if (!user.value?.phone) return "";
  const raw = user.value.phone.replace(/\D/g, "");
  if (raw.length === 12) {
    return `+${raw.slice(0, 3)} (${raw.slice(3, 5)}) ${raw.slice(
      5,
      8
    )}-${raw.slice(8, 10)}-${raw.slice(10, 12)}`;
  }
  return user.value.phone;
});

onMounted(() => {
  userStore.getMe().then(() => {
    if (user.value) {
      form.value.full_name = user.value.full_name;
      form.value.email = user.value.email;
      form.value.address = user.value.address;
      form.value.phone = user.value.phone;
    }
  });
});

const confirmLogout = () => {
  authStore.logout();
  isLogoutConfirmOpen.value = false;
};

const updateProfile = async () => {
  try {
    const payload = { ...form.value };
    if (payload.phone) {
      payload.phone = payload.phone.replace(/\D/g, "");
    }
    const res = await userStore.updateMyProfile(payload);
    if (res.ok) {
      isModalOpen.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
