<template>
  <div class="max-w-6xl mx-auto lg:px-6 lg:pt-10">
    <div
      v-if="dashboardStore.loading"
      class="flex items-center justify-center gap-2 text-gray-400"
    >
      <svg
        class="animate-spin h-5 w-5"
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
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      Yuklanmoqda...
    </div>

    <div
      v-else-if="dashboardStore.error"
      class="p-4 bg-red-50 text-red-600 rounded-xl text-center"
    >
      {{ dashboardStore.error }}
    </div>

    <div v-else>
      <div
        class="flex gap-2 font-bold text-primary mb-5 items-center md:hidden"
      >
        <LayoutDashboard class="w-5 h-5" />
        <h2 class="text-lg">Boshqaruv paneli</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="item in cards"
          :key="item.key"
          class="rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition"
          :class="item.bg"
        >
          <div>
            <p class="text-sm text-gray-500 mb-1">{{ item.title }}</p>
            <p class="text-2xl font-medium text-gray-700">
              {{ item.value }}
              <span class="text-sm text-gray-400">dona</span>
            </p>
          </div>
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center"
            :class="item.iconBg"
          >
            <component
              :is="item.icon"
              class="w-5 h-5"
              :class="item.iconColor"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import {
  Users,
  CalendarCheck,
  CalendarX,
  TestTube2,
  Image,
  Trophy,
  MessageCircle,
  Stethoscope,
  LayoutDashboard,
} from "lucide-vue-next";

const dashboardStore = useDashboardStore();
const summary = computed(() => dashboardStore.summary || {});

const cards = computed(() => [
  {
    key: "users",
    title: "Foydalanuvchilar soni",
    value: summary.value.users ?? 0,
    icon: Users,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "services",
    title: "Xizmatlar soni",
    value: summary.value.services ?? 0,
    icon: Stethoscope,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    key: "specialists",
    title: "Mutaxassislar soni",
    value: summary.value.specialists ?? 0,
    icon: Users,
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    key: "specServices",
    title: "Mutaxassis xizmatlari soni",
    value: summary.value.specServices ?? 0,
    icon: Stethoscope,
    bg: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    key: "bookings",
    title: "Bronlar soni",
    value: summary.value.bookings?.total ?? 0,
    icon: CalendarCheck,
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    key: "cancelledBookings",
    title: "Bekor qilingan bronlar soni",
    value: summary.value.bookings?.cancelled ?? 0,
    icon: CalendarX,
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    key: "analysisResult",
    title: "Analiz natijalari soni",
    value: summary.value.analysisResult ?? 0,
    icon: TestTube2,
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    key: "banners",
    title: "Bannerlar soni",
    value: summary.value.banners ?? 0,
    icon: Image,
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    key: "achievements",
    title: "Yutuqlar soni",
    value: summary.value.achievements ?? 0,
    icon: Trophy,
    bg: "bg-lime-50",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-600",
  },
  {
    key: "messages",
    title: "Xabarlar soni",
    value: summary.value.messages ?? 0,
    icon: MessageCircle,
    bg: "bg-gray-50",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
  },
]);

onMounted(() => {
  dashboardStore.getSummary();
});
</script>
