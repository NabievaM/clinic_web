<template>
  <AppLayout>
    <div class="bg-gradient-to-b from-gray-50 to-gray-100 py-5">
      <div class="max-w-7xl mx-auto px-6">
        <h1 class="text-4xl font-bold text-gray-800 mb-7 text-center">
          Bog‘lanish
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div
            class="lg:col-span-1 bg-white shadow-xl rounded-2xl p-8 space-y-6"
          >
            <h2 class="text-xl font-semibold text-gray-700 mb-4">
              Aloqa ma’lumotlari
            </h2>

            <div class="flex items-center gap-4">
              <MapPin class="w-6 h-6 text-blue-600" />
              <p class="text-gray-700">{{ clinic?.address }}</p>
            </div>

            <div class="flex items-center gap-4">
              <Phone class="w-6 h-6 text-blue-600" />
              <a
                :href="`tel:${clinic?.phone}`"
                class="text-blue-600 hover:underline"
              >
                {{ clinic?.phone }}
              </a>
            </div>

            <div class="flex items-center gap-4">
              <Mail class="w-6 h-6 text-blue-600" />
              <a
                :href="`mailto:${clinic?.email}`"
                class="text-blue-600 hover:underline"
              >
                {{ clinic?.email }}
              </a>
            </div>

            <div class="flex items-center gap-4">
              <Clock class="w-6 h-6 text-blue-600" />
              <div class="whitespace-pre-line">
                {{ clinic?.working_hours }}
              </div>
            </div>

            <div v-if="accounts.length" class="flex gap-4 pt-4">
              <a
                v-for="account in accounts"
                :key="account.id"
                :href="account.url"
                target="_blank"
                class="text-blue-600 hover:text-blue-800 transition"
              >
                <svg
                  v-if="account.platform === 'facebook'"
                  class="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 
              1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 
              1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12Z"
                  />
                </svg>

                <svg
                  v-else-if="account.platform === 'instagram'"
                  class="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 
              5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7Zm10 
              2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 
              3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 
              3-3h10Zm-5 3a5 5 0 1 0 0 10 5 5 
              0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 
              3 0 0 1 0-6Zm4.8-.9a1.1 1.1 0 1 
              0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
                  />
                </svg>

                <svg
                  v-else-if="account.platform === 'telegram'"
                  class="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9.9 16.2 9.7 20c.4 0 .6-.2.8-.4l2-2 
              4.1 3c.8.5 1.4.2 1.6-.8l2.9-13.7c.3-1.2-.4-1.7-1.2-1.4L3.6 
              9.2c-1.2.5-1.2 1.2-.2 1.5l4.2 1.3L17.4 6c.5-.3.9-.1.5.2L9.9 
              16.2Z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-8">
            <div
              v-if="clinic?.map_location"
              class="bg-white shadow-xl rounded-2xl overflow-hidden"
            >
              <h2
                class="text-lg font-semibold text-gray-700 px-6 py-3 border-b"
              >
                Bizni toping
              </h2>
              <iframe
                :src="`https://maps.google.com/maps?q=${clinic.map_location}&z=15&output=embed`"
                class="w-full h-72"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>

            <div class="bg-white shadow-xl rounded-2xl p-8">
              <h2 class="text-xl font-semibold text-gray-700 mb-2">
                Xabar yuborish
              </h2>
              <p class="text-sm text-gray-500 mb-6">
                Savol yoki takliflaringizni qoldiring, biz tez orada siz bilan
                bog‘lanamiz.
              </p>

              <form @submit.prevent="submitForm" class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Ism
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Ismingizni kiriting"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Telefon
                  </label>
                  <input
                    v-imask="phoneMask"
                    :value="form.phone"
                    @accept="onPhoneAccept"
                    type="tel"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="+998 (__) ___-__-__"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">
                    Xabar
                  </label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Xabaringizni yozing..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="userMessageStore.loading"
                  class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-60"
                >
                  {{
                    userMessageStore.loading ? "Yuborilmoqda..." : "Yuborish"
                  }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 bg-green-400 text-white px-6 py-3 rounded-xl shadow-lg"
      >
        Xabaringiz yuborildi!
      </div>
    </transition>
  </AppLayout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useClinicStore } from "@/stores/clinic";
import { useSocialAccountStore } from "@/stores/socialAccount";
import { useUserMessageStore } from "@/stores/userMessage";
import { MapPin, Phone, Mail, Clock } from "lucide-vue-next";
import AppLayout from "../layouts/AppLayout.vue";

const clinicStore = useClinicStore();
clinicStore.getClinic();
const { clinic } = storeToRefs(clinicStore);

const socialStore = useSocialAccountStore();
const { accounts } = storeToRefs(socialStore);
const { getSocialAccounts } = socialStore;

const userMessageStore = useUserMessageStore();

const form = reactive({
  name: "",
  phone: "",
  message: "",
});

const showToast = ref(false);

const phoneMask = {
  mask: "+{998} (00) 000-00-00",
  lazy: false,
};

const onPhoneAccept = (e) => {
  form.phone = e.detail.value;
};

const submitForm = async () => {
  await userMessageStore.sendMessage({
    name: form.name,
    phone: form.phone.replace(/\D/g, ""),
    message: form.message,
  });

  form.name = "";
  form.phone = "";
  form.message = "";

  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

onMounted(() => {
  getSocialAccounts();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
