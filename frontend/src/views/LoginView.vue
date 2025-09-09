<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <AuthForm
      title="Tizimga kirish"
      buttonText="Kirish"
      :isRegister="false"
      :onSubmit="loginHandler"
    >
      <p class="text-sm text-gray-500">
        Email <b>yoki</b> telefon raqam orqali kirishingiz mumkin. <br />
        Akkountingiz yo‘qmi?
        <router-link to="/register" class="text-blue-600 hover:underline">
          Ro‘yxatdan o‘ting
        </router-link>
      </p>
    </AuthForm>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import AuthForm from "@/components/AuthForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();

const loginHandler = async (form) => {
  try {
    await auth.login(form);
    router.push("/");
  } catch (err) {
    throw err;
  }
};
</script>
  