<template>
  <div
    v-if="analysisStore.loading"
    class="flex justify-center items-center py-6 text-sm text-gray-500"
  >
    ⏳ Yuklanmoqda...
  </div>

  <div v-if="analysisStore.error" class="text-center py-4 text-sm text-red-500">
    ❌ {{ analysisStore.error }}
  </div>

  <router-link
    to="/admin/analysis-results"
    class="mb-5 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 text-sm"
  >
    ⬅️ Ortga
  </router-link>

  <div
    v-if="analysisStore.result"
    class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8"
  >
    <div class="lg:w-1/3 flex justify-center items-center relative">
      <div
        class="w-full h-[480px] overflow-hidden rounded-2xl shadow-lg border border-gray-200"
      >
        <iframe
          v-if="isPdf(analysisStore.result.file_url) && isDesktop"
          :src="
            getFileUrl(analysisStore.result.file_url) +
            '#toolbar=0&navpanes=0&scrollbar=0'
          "
          class="w-full h-full object-contain"
          frameborder="0"
          scrolling="no"
        ></iframe>

        <div
          v-else-if="isPdf(analysisStore.result.file_url) && !isDesktop"
          class="flex flex-col justify-center items-center h-full bg-gray-50 p-6 rounded-lg"
        >
          <a
            :href="getFileUrl(analysisStore.result.file_url)"
            target="_blank"
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition"
          >
            📄 PDFni ochish
          </a>
        </div>

        <img
          v-else
          :src="getFileUrl(analysisStore.result.file_url)"
          alt="Analysis Result"
          class="w-full h-full object-contain"
        />
      </div>

      <a
        v-if="isDesktop"
        :href="getFileUrl(analysisStore.result.file_url)"
        download
        class="absolute top-1 right-3 bg-gray-400 text-white p-2 rounded shadow hover:bg-gray-600 flex items-center justify-center"
      >
        <DownloadIcon class="w-4 h-4" />
      </a>
    </div>

    <div class="lg:w-1/3 flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-primary">
        {{ analysisStore.result.description }}
      </h1>

      <div class="space-y-2 text-sm text-gray-700">
        <div class="bg-gray-50 p-3 rounded shadow-sm">
          <b>ID:</b> {{ analysisStore.result.id }}
        </div>
        <div class="bg-gray-50 p-3 rounded shadow-sm">
          <b>Booking ID:</b> {{ analysisStore.result.booking_id }}
        </div>
        <div class="bg-gray-50 p-3 rounded shadow-sm">
          <b>Qo‘shilgan sana:</b>
          {{ formatDate(analysisStore.result.createdAt) }}
        </div>
        <div class="bg-gray-50 p-3 rounded shadow-sm">
          <b>Yangilangan sana:</b>
          {{ formatDate(analysisStore.result.updatedAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, defineProps } from "vue";
import { useAnalysisResultStore } from "@/stores/analysisResult";
import { DownloadIcon } from "lucide-vue-next";

const props = defineProps({ id: String });
const analysisStore = useAnalysisResultStore();

const isDesktop = ref(window.innerWidth >= 1024);

function handleResize() {
  isDesktop.value = window.innerWidth >= 1024;
}

onMounted(() => {
  analysisStore.getResultById(props.id);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function getFileUrl(file) {
  return `${import.meta.env.VITE_API_URL}/uploads/${file}`;
}

function isPdf(file) {
  return file && file.toLowerCase().endsWith(".pdf");
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
a {
  transition: 0.3s;
}
iframe,
img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>
