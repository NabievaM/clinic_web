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

    <p class="text-gray-600 mb-4 line-clamp-3">
      {{ service.description }}
    </p>

    <div class="mt-auto flex justify-between text-sm text-gray-700 pt-4">
      <span><strong>Narxi:</strong> {{ service.price }} so'm</span>
      <span><strong>Davomiyligi:</strong> {{ service.duration }} min</span>
    </div>

    <button
      class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
      @click="openBooking"
    >
      Bron qilish
    </button>

    <div
      v-if="showBooking"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          @click="closeBooking"
        >
          ✕
        </button>

        <h2 class="text-2xl font-bold mb-4 text-blue-700">
          Xizmatni bron qilish
        </h2>

        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <p><strong>Xizmat:</strong> {{ service.name }}</p>
          <p><strong>Narxi:</strong> {{ service.price }} so'm</p>
          <p><strong>Davomiyligi:</strong> {{ service.duration }} daqiqa</p>
        </div>

        <label class="block mb-2 text-sm font-medium text-gray-700">
          Mutaxassisni tanlang:
        </label>
        <div class="space-y-3 max-h-52 overflow-y-auto mb-4">
          <div
            v-for="spec in specialists"
            :key="spec.id"
            @click="selectedSpecialist = spec.specialist"
            :class="[
              'flex items-center p-3 rounded-lg border cursor-pointer transition',
              selectedSpecialist?.id === spec.specialist.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-100',
            ]"
          >
            <img
              :src="getPhotoUrl(spec.specialist.photo)"
              alt="spec"
              class="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div>
              <p class="font-medium text-gray-800">
                {{ spec.specialist.user.full_name }}
              </p>
              <p class="text-sm text-gray-500">
                {{ spec.specialist.position }} –
                {{ spec.specialist.experience_years }}
              </p>
              <p class="text-xs text-gray-400">
                {{ spec.specialist.specialization }}
              </p>
            </div>
          </div>
        </div>

        <label class="block mb-2 text-sm font-medium text-gray-700"
          >Sana:</label
        >
        <input
          type="date"
          v-model="selectedDate"
          class="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <label class="block mb-2 text-sm font-medium text-gray-700"
          >Vaqt:</label
        >
        <input
          type="time"
          v-model="selectedTime"
          class="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <button
          class="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition w-full"
          @click="bookNow"
        >
          Tasdiqlash
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "@/plugins/axios";
import { createBooking } from "../api/booking";
import { createSpecialistService } from "../api/specialist-service";

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
});

const showBooking = ref(false);
const specialists = ref([]);
const selectedSpecialist = ref(null);
const selectedDate = ref(null);
const selectedTime = ref(null);

const openBooking = async () => {
  showBooking.value = true;
  try {
    const res = await createSpecialistService(props.service.id)
    specialists.value = res.data;
  } catch (error) {
    console.error("❌ Specialistlarni olishda xatolik:", error);
  }
};

const closeBooking = () => {
  showBooking.value = false;
};

const bookNow = async () => {
  if (!selectedSpecialist.value || !selectedDate.value || !selectedTime.value) {
    alert("Iltimos, barcha maydonlarni to‘ldiring!");
    return;
  }

  const bookingData = {
    service_id: props.service.id,
    specialist_id: selectedSpecialist.value.id,
    booking_datetime: new Date(
      `${selectedDate.value}T${selectedTime.value}:00Z`
    ).toISOString(),
  };

  try {
    await createBooking(bookingData);
    alert("✅ Bron muvaffaqiyatli amalga oshirildi!");
    closeBooking();
  } catch (error) {
    console.error("❌ Bron qilishda xatolik:", error.response?.data || error);
    alert("❌ Bron qilishda muammo yuz berdi!");
  }
};

const getPhotoUrl = (filename) =>
  `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
</script>
