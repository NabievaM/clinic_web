<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 py-16">
    <AuthForm
      title="Yangi akkaunt yarating"
      buttonText="Ro‘yxatdan o‘tish"
      :isRegister="true"
      :onSubmit="registerHandler"
    >
      <p class="text-sm text-gray-500">
        Allaqachon akkauntingiz bormi?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Kirish
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

const registerHandler = async (form) => {
  try {
    await auth.register(form);
    router.push("/login");
  } catch (err) {
    throw err;
  }
};
</script>
