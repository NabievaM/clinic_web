<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative">
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
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

      <label class="block mb-2 text-sm font-medium text-gray-700">Sana:</label>
      <input
        type="date"
        v-model="selectedDate"
        class="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <label class="block mb-2 text-sm font-medium text-gray-700">Vaqt:</label>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createBooking } from "../api/booking";
import { fetchSpecialistsByService } from "../api/specialist-service";

const props = defineProps({
  service: { type: Object, required: true },
});

const emit = defineEmits(["close", "success"]);

const specialists = ref([]);
const selectedSpecialist = ref(null);
const selectedDate = ref(null);
const selectedTime = ref(null);

onMounted(async () => {
  try {
    const res = await fetchSpecialistsByService(props.service.id);
    specialists.value = res.data;
  } catch (error) {
    console.error("❌ Specialistlarni olishda xatolik:", error);
  }
});

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
    emit("close");
    emit("success");
  } catch (error) {
    console.error("❌ Bron qilishda xatolik:", error.response?.data || error);
    alert("❌ Bron qilishda muammo yuz berdi!");
  }
};

const getPhotoUrl = (filename) =>
  `${import.meta.env.VITE_API_URL}/uploads/${filename}`;
</script>
