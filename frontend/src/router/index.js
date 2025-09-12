import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import Contact from "@/views/Contact.vue";
import Profile from "@/views/Profile.vue";
import { useAuthStore } from "@/stores/auth";
import NotFound from "@/views/NotFound.vue";
import SpecialistDetail from "@/views/SpecialistDetail.vue";
import Achievement from "@/views/Achievement.vue";
import Service from "@/views/ServicesView.vue";
import SpecialistView from "@/views/SpecialistView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/specialist/:id",
    name: "SpecialistDetail",
    component: SpecialistDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/achievement",
    name: "Achievement",
    component: Achievement,
    meta: { requiresAuth: true },
  },
  {
    path: "/services",
    name: "Service",
    component: Service,
    meta: { requiresAuth: true },
  },
  {
    path: "/specialists",
    name: "Specialist",
    component: SpecialistView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.accessToken) {
    next("/login");
  } else {
    next();
  }
});

export default router;
