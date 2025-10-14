<template>
  <div class="w-full max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
      {{ title }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="isRegister" class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Ism va familiyangizni kiriting
        </label>
        <input
          v-model="form.full_name"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
        <p v-if="errors.full_name" class="text-red-500 text-sm mt-1">
          {{ errors.full_name }}
        </p>
      </div>

      <div v-if="isRegister" class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Manzilingiz <span class="text-gray-400">(ixtiyoriy)</span>
        </label>
        <input
          v-model="form.address"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Email manzilingiz
          <span v-if="!isRegister" class="text-gray-400">(ixtiyoriy)</span>
        </label>
        <input
          v-model="form.email"
          type="email"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Telefon raqamingiz
        </label>
        <input
          v-imask="phoneMask"
          :value="form.phone"
          @accept="onPhoneAccept"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
        <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
          {{ errors.phone }}
        </p>
      </div>

      <div class="flex flex-col relative">
        <label class="text-sm font-medium text-gray-700 mb-1">
          Parolingiz
        </label>
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          class="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
        >
          <svg
            v-if="showPassword"
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
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 
                     8.268 2.943 9.542 7-1.274 4.057-5.064 
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
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </p>
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        {{ buttonText }}
      </button>
    </form>

    <p v-if="errors.general" class="text-red-500 text-sm mt-3 text-center">
      {{ errors.general }}
    </p>

    <p class="text-center mt-5 text-sm text-gray-600">
      <slot />
    </p>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const props = defineProps({
  title: String,
  buttonText: String,
  onSubmit: Function,
  isRegister: Boolean,
});

const form = reactive({
  full_name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
});

const errors = reactive({
  full_name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  general: "",
});

const showPassword = ref(false);

const phoneMask = {
  mask: "+{998} (00) 000-00-00",
  lazy: false,
};

const onPhoneAccept = (e) => {
  form.phone = e.detail.value;
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateForm = () => {
  let valid = true;
  Object.keys(errors).forEach((k) => (errors[k] = ""));

  if (props.isRegister) {
    if (!form.full_name.trim()) {
      errors.full_name = "Ism va familiya majburiy.";
      valid = false;
    }
    if (!form.email) {
      errors.email = "Email majburiy.";
      valid = false;
    } else if (!validateEmail(form.email)) {
      errors.email = "Email noto‘g‘ri formatda.";
      valid = false;
    }

    if (!form.phone) {
      errors.phone = "Telefon raqam majburiy.";
      valid = false;
    } else {
      const digits = form.phone.replace(/\D/g, "");
      if (!digits.startsWith("998") || digits.length !== 12) {
        errors.phone = "Telefon raqam to‘liq kiritilishi kerak.";
        valid = false;
      }
    }
  }

  if (!form.password) {
    errors.password = "Parol majburiy.";
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = "Parol kamida 6 ta belgidan iborat bo‘lishi kerak.";
    valid = false;
  }

  return valid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const payload = { ...form };
    if (payload.phone) {
      payload.phone = payload.phone.replace(/\D/g, "");
    }
    if (!payload.address) delete payload.address;

    await props.onSubmit(payload);
  } catch (err) {
    const data = err;
    if (data?.field && data?.message) {
      errors[data.field] = data.message;
    } else if (typeof data?.message === "string") {
      errors.general = data.message;
    } else {
      errors.general = "Noma’lum xatolik";
    }
  }
};
</script>
