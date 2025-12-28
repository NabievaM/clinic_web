<template>
  <div v-if="!clinicStore.loading && clinicStore.clinic">
    <div
      class="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row gap-6 relative"
    >
      <button
        @click="openEditModal"
        class="absolute top-4 right-4 flex items-center gap-1 p-2 bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 transition"
      >
        <Edit3 class="w-4 h-4" />
      </button>

      <div class="flex-shrink-0 flex justify-center items-start">
        <img
          :src="getLogoUrl(clinicStore.clinic.logo_url)"
          alt="Logo"
          class="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
          @error="onLogoError"
        />
      </div>

      <div class="flex-1 space-y-3">
        <h2 class="text-2xl font-bold text-gray-800 text-center md:text-left">
          {{ clinicStore.clinic.name }}
        </h2>

        <p class="text-gray-600">
          <strong>Manzil:</strong> {{ clinicStore.clinic.address }}
        </p>

        <p class="text-gray-600">
          <strong>Telefon:</strong> {{ clinicStore.clinic.phone }}
        </p>

        <p class="text-gray-600">
          <strong>Email:</strong> {{ clinicStore.clinic.email }}
        </p>

        <div class="text-gray-600">
          <strong>Ish vaqtlari:</strong>
          <div
            class="mt-1 bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-line"
          >
            {{ clinicStore.clinic.working_hours || "—" }}
          </div>
        </div>

        <p class="text-gray-600">
          <strong>Joylashuv:</strong> {{ clinicStore.clinic.map_location }}
        </p>

        <p
          class="text-gray-500 text-[11px] md:text-xs flex flex-wrap items-center gap-x-3 gap-y-1"
        >
          <span class="flex items-center gap-1">
            <Calendar class="w-3 h-3 text-blue-500" />
            Qo‘shilgan: {{ formatDate(clinicStore.clinic.createdAt) }}
          </span>

          <span class="flex items-center gap-1">
            <RefreshCw class="w-3 h-3 text-blue-500" />
            Yangilangan: {{ formatDate(clinicStore.clinic.updatedAt) }}
          </span>
        </p>
      </div>
    </div>

    <EditModal
      :visible="showEdit"
      title="Klinika ma’lumotlarini tahrirlash"
      :formData="editClinicData"
      :fields="editFields"
      :error="editFormError"
      @save="confirmEdit"
      @cancel="cancelEdit"
    />
  </div>

  <div
    v-if="clinicStore.error"
    class="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center"
  >
    ❌ {{ clinicStore.error }}
  </div>

  <div
    v-if="!clinicStore.loading && !clinicStore.clinic"
    class="text-gray-500 mt-6 text-center"
  >
    Klinik ma’lumot topilmadi 🙅‍♂️
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useClinicStore } from "@/stores/clinic";
import EditModal from "@/components/admin/common/EditModal.vue";
import { Edit3, Calendar, RefreshCw } from "lucide-vue-next";

const clinicStore = useClinicStore();
const showEdit = ref(false);
const editClinicData = ref({});
const editFormError = ref("");

const editFields = [
  { label: "Klinika nomi", model: "name", type: "text" },
  { label: "Telefon raqam", model: "phone", type: "text" },
  { label: "Email", model: "email", type: "email" },
  {
    label: "Joylashuv",
    model: "map_location",
    type: "text",
  },
  { label: "Manzil", model: "address", type: "text", colSpan: 2 },
  {
    label: "Ish vaqtlari",
    model: "working_hours",
    type: "textarea",
    placeholder: "Dushanba 10:00-20:00",
    colSpan: 2,
  },
  { label: "Logo", model: "logo_url", type: "file", colSpan: 2 },
];

onMounted(() => clinicStore.getClinic());

function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLogoUrl(l) {
  if (!l) return "/no-logo.png";
  if (l.startsWith("http")) return l;
  return `http://localhost:3001/uploads/${l}`;
}

function onLogoError(e) {
  e.target.src = "/no-logo.png";
}

function openEditModal() {
  editClinicData.value = {
    ...clinicStore.clinic,
    working_hours: clinicStore.clinic.working_hours,
  };
  showEdit.value = true;
}

async function confirmEdit(d) {
  editFormError.value = "";
  try {
    const id = clinicStore.clinic?.id;
    if (!id) {
      editFormError.value = "❌ Klinika topilmadi!";
      return;
    }

    if (d.logo_url instanceof File) {
      const f = new FormData();
      f.append("logo_url", d.logo_url);
      await clinicStore.updateClinicLogo(id, f);
    }

    await clinicStore.updateClinic(id, {
      ...d,
      logo_url: undefined,
    });

    showEdit.value = false;
  } catch (e) {
    editFormError.value = e.response?.data?.message || e.message;
  }
}

function cancelEdit() {
  showEdit.value = false;
}
</script>

<style scoped>
.text-primary {
  color: #007dc5;
}
</style>
