<template>
  <div
    class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow flex flex-col"
  >
    <div class="flex items-center mb-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4"
      >
        <i class="fa-solid fa-stethoscope"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">
        {{ service.name }}
      </h3>
    </div>

    <p class="text-gray-600 mb-4 line-clamp-3">{{ service.description }}</p>

    <div class="mt-auto flex justify-between text-sm text-gray-700 pt-4">
      <span class="text-green-600"
        ><strong class="text-gray-700">Narxi:</strong>
        {{ formatPrice(service.price) }}</span
      >
      <span><strong>Davomiyligi:</strong> {{ service.duration }} daqiqa</span>
    </div>

    <button
      class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
      @click="openBooking"
    >
      Bron qilish
    </button>

    <BookingModal
      v-if="showBooking"
      :service="service"
      @close="showBooking = false"
      @success="bookingSuccess = true"
    />

    <BookingSuccess v-if="bookingSuccess" @close="bookingSuccess = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BookingModal from "./BookingModal.vue";
import BookingSuccess from "./BookingSuccess.vue";

const props = defineProps({
  service: { type: Object, required: true },
});

const router = useRouter();
const auth = useAuthStore();
const showBooking = ref(false);
const bookingSuccess = ref(false);

const openBooking = () => {
  if (!auth.accessToken) {
    router.push("/login");
    return;
  }
  showBooking.value = true;
};

function formatPrice(price) {
  if (!price) return "0 so‘m";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}
</script>
