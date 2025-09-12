<template>
  <div
    class="bg-white rounded-xl shadow-xl border-t border-gray-100 hover:shadow-md transition-transform transform hover:-translate-y-1 overflow-hidden text-center"
  >
    <div class="p-4 flex flex-col items-center">
      <img
        :src="`http://localhost:3000/uploads/${specialist.photo}`"
        alt="mutaxassis rasmi"
        class="w-20 h-20 rounded-full object-cover shadow mb-3"
      />
      <h3 class="text-xl font-semibold text-gray-800">
        {{ specialist.full_name }}
      </h3>
      <p class="text-primary text-lg">{{ specialist.position }}</p>

      <span
        class="mt-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
      >
        {{ specialist.experience_years }} yil tajriba
      </span>

      <p class="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2">
        {{ specialist.description }}
      </p>

      <router-link
        :to="`/specialist/${specialist.id}`"
        class="mt-3 text-primary font-medium hover:underline text-sm"
      >
        Batafsil →
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  specialist: {
    type: Object,
    required: true,
  },
});
</script>
