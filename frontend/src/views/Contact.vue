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
              <p class="text-gray-700">{{ clinic?.working_hours }}</p>
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
              <form class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Ism</label
                  >
                  <input
                    type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Ismingizni kiriting"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Telefon</label
                  >
                  <input
                    type="tel"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Xabar</label
                  >
                  <textarea
                    rows="4"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Xabaringizni yozing..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-blue-800 transition"
                >
                  Yuborish
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useClinicStore } from "@/stores/clinic";
import { MapPin, Phone, Mail, Clock } from "lucide-vue-next";
import AppLayout from "../layouts/AppLayout.vue";

const store = useClinicStore();
store.getClinic();
const { clinic } = storeToRefs(store);
</script>
