<template>
  <header class="shadow-sm bg-white sticky top-0 z-50">
    <div
      class="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-6"
    >
      <RouterLink
        to="/"
        class="flex items-center space-x-3 hover:opacity-90 transition"
      >
        <img
          v-if="clinic?.logo_url"
          :src="`http://localhost:3001/uploads/${clinic.logo_url}`"
          alt="logo"
          class="w-10 h-10 rounded-full object-cover shadow-sm"
        />
        <span class="text-xl md:text-2xl font-bold text-primary tracking-tight">
          {{ clinic?.name }}
        </span>
      </RouterLink>

      <nav class="hidden md:flex font-medium items-center space-x-8">
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ active: current === 'home' }"
        >
          Bosh sahifa
        </RouterLink>

        <RouterLink
          to="/services"
          class="nav-link"
          :class="{ active: current === 'services' }"
        >
          Xizmatlar
        </RouterLink>

        <RouterLink
          to="/specialists"
          class="nav-link"
          :class="{ active: current === 'specialists' }"
        >
          Mutaxassislar
        </RouterLink>

        <RouterLink
          to="/contact"
          class="nav-link"
          :class="{ active: current === 'contact' }"
        >
          Bog‘lanish
        </RouterLink>

        <RouterLink
          to="/profile"
          class="nav-link"
          :class="{ active: current === 'profile' }"
        >
          Mening Profilim
        </RouterLink>

        <RouterLink
          v-if="auth.user?.role === 'admin'"
          to="/admin/dashboard"
          class="nav-link bg-primary px-2 py-1 rounded-lg !text-white hover:scale-105"
        >
          Admin panel
        </RouterLink>

        <RouterLink
          v-if="auth.user?.role === 'specialist'"
          :to="`/specialist/${auth.user.id}/bookings`"
          class="nav-link"
          :class="{ active: current === 'booking' }"
        >
          Bronlar
        </RouterLink>

        <RouterLink
          v-if="auth.user?.role === 'specialist'"
          :to="`/specialist/${auth.user.id}/analysis-results`"
          class="nav-link"
          :class="{ active: current === 'analysis' }"
        >
          Analiz natijalari
        </RouterLink>

        <RouterLink
          v-if="auth.user?.role === 'patient'"
          to="/specialist/appointments"
          class="nav-link"
        >
          Bronlarim
        </RouterLink>

        <RouterLink
          v-if="auth.user?.role === 'patient'"
          to="/specialist/analysis"
          class="nav-link"
        >
          Analiz natijalarim
        </RouterLink>
      </nav>

      <button
        @click="isOpen = !isOpen"
        class="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <svg
          class="w-7 h-7 text-gray-700"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <transition name="slide-fade">
      <div v-if="isOpen" class="md:hidden bg-white shadow-md border-t">
        <nav class="flex flex-col space-y-4 p-4">
          <RouterLink
            to="/"
            class="mobile-link"
            :class="{ active: current === 'home' }"
            >Bosh sahifa</RouterLink
          >
          <RouterLink
            to="/services"
            class="mobile-link"
            :class="{ active: current === 'services' }"
          >
            Xizmatlar
          </RouterLink>

          <RouterLink
            to="/specialists"
            class="mobile-link"
            :class="{ active: current === 'specialists' }"
          >
            Mutaxassislar
          </RouterLink>

          <RouterLink
            to="/contact"
            class="mobile-link"
            :class="{ active: current === 'contact' }"
            >Bog‘lanish</RouterLink
          >

          <RouterLink
            to="/profile"
            class="mobile-link"
            :class="{ active: current === 'profile' }"
            >Mening Profilim</RouterLink
          >

          <RouterLink
            v-if="auth.user?.role === 'admin'"
            to="/admin/dashboard"
            class="mobile-link"
          >
            Admin panel
          </RouterLink>

          <RouterLink
            v-if="auth.user?.role === 'specialist'"
            :to="`/specialist/${auth.user.id}/bookings`"
            class="mobile-link"
            :class="{ active: current === 'booking' }"
          >
            Bronlar
          </RouterLink>

          <RouterLink
            v-if="auth.user?.role === 'specialist'"
            :to="`/specialist/${auth.user.id}/analysis-results`"
            class="mobile-link"
            :class="{ active: current === 'analysis' }"
          >
            Analiz natijalari
          </RouterLink>

          <RouterLink
            v-if="auth.user?.role === 'patient'"
            to="/specialist/appointments"
            class="mobile-link"
          >
            Bronlarim
          </RouterLink>

          <RouterLink
            v-if="auth.user?.role === 'patient'"
            to="/specialist/analysis"
            class="mobile-link"
          >
            Analiz natijalarim
          </RouterLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useClinicStore } from "@/stores/clinic";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";

const auth = useAuthStore();
const isOpen = ref(false);
const route = useRoute();

const current = computed(() => {
  if (route.path === "/") return "home";
  if (route.path.startsWith("/services")) return "services";
  if (route.path.startsWith("/specialists")) return "specialists";
  if (route.path.startsWith("/contact")) return "contact";
  if (route.path.startsWith("/profile")) return "profile";
  if (route.path.startsWith(`/specialist/${auth.user.id}/bookings`))
    return "booking";
  if (route.path.startsWith(`/specialist/${auth.user.id}/analysis-results`))
    return "analysis";

  return "";
});

const store = useClinicStore();
store.getClinic();
const { clinic } = storeToRefs(store);
</script>

<style scoped>
.nav-link {
  position: relative;
  color: #374151;
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: var(--color-primary, #007dc5);
}
.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  background-color: var(--color-primary, #007dc5);
  transition: width 0.3s ease;
}
.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.mobile-link {
  color: #374151;
  transition: color 0.3s ease;
  position: relative;
  padding-bottom: 4px;
}
.mobile-link:hover {
  color: var(--color-primary, #007dc5);
}
.mobile-link.active {
  color: var(--color-primary, #007dc5);
}
.mobile-link.active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary, #007dc5);
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
