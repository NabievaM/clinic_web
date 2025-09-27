import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import Contact from "@/views/Contact.vue";
import Profile from "@/views/Profile.vue";
import NotFound from "@/views/NotFound.vue";
import SpecialistDetail from "@/views/SpecialistDetail.vue";
import Achievement from "@/views/Achievement.vue";
import Service from "@/views/ServicesView.vue";
import SpecialistView from "@/views/SpecialistView.vue";

import AdminLayout from "@/layouts/AdminLayout.vue";
import Dashboard from "@/views/admin/Dashboard.vue";
import Users from "@/views/admin/Users.vue";
import Services from "@/views/admin/Services.vue";
import Statistics from "@/views/admin/Statistics.vue";
import Banners from "@/views/admin/Banners.vue";
import Achievements from "@/views/admin/Achievements.vue";
// import Pages from "@/views/admin/Pages.vue";
import Socials from "@/views/admin/Socials.vue";
import BannerDetail from "@/views/admin/BannerDetail.vue";
import AchievementDetail from "@/views/admin/AchievementDetail.vue";

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
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: "dashboard", name: "AdminDashboard", component: Dashboard },
      { path: "users", name: "AdminUsers", component: Users },
      { path: "services", name: "AdminServices", component: Services },
      { path: "statistics", name: "AdminStatistics", component: Statistics },
      { path: "banners", name: "AdminBanners", component: Banners },
      {
        path: "achievements",
        name: "AdminAchievements",
        component: Achievements,
      },
      {
        path: "achievement/:id",
        name: "AdminAchievementDetail",
        component: AchievementDetail,
      },

      // { path: "pages", name: "AdminPages", component: Pages },
      { path: "socials", name: "AdminSocials", component: Socials },
      {
        path: "banner/:id",
        name: "AdminBannerDetail",
        component: BannerDetail,
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (to.name === "Login" && auth.accessToken) {
    return next("/");
  }

  if (to.meta.requiresAuth && !auth.accessToken) {
    return next("/login");
  }

  if (!auth.user && auth.accessToken) {
    await auth.fetchUser();
  }

  if (to.meta.requiresAdmin && auth.user?.role !== "admin") {
    return next("/");
  }

  return next();
});

export default router;
