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
import Socials from "@/views/admin/Socials.vue";
import BannerDetail from "@/views/admin/BannerDetail.vue";
import AchievementDetail from "@/views/admin/AchievementDetail.vue";
import Specialists from "@/views/admin/Specialists.vue";
import AdminSpecialistDetail from "@/views/admin/SpecialistDetail.vue";
import SpecialistServices from "@/views/admin/SpecialistServices.vue";
import Bookings from "@/views/admin/Bookings.vue";
import AnalysisResults from "@/views/admin/AnalysisResults.vue";
import ClinicSettings from "@/views/admin/ClinicSettings.vue";
import SpecialistServiceDetail from "@/views/admin/SpecialistServiceDetail.vue";
import AnalysisResultDetail from "@/views/admin/AnalysisResultDetail.vue";
import SpecialistAnalysis from "@/views/specialist/AnalysisResults.vue";
import SpecialistBookings from "@/views/specialist/Bookings.vue";
import SpecialistAnalysisDetail from "@/views/specialist/AnalysisResultDetail.vue";
import PatientAnalysis from "@/views/patient/AnalysisResults.vue";
import PatientBookings from "@/views/patient/Bookings.vue";
import PatientAnalysisDetail from "@/views/patient/AnalysisResultDetail.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/services", name: "Service", component: Service },
  { path: "/specialists", name: "Specialist", component: SpecialistView },
  { path: "/achievement", name: "Achievement", component: Achievement },
  { path: "/contact", name: "Contact", component: Contact },
  {
    path: "/specialist/:id",
    name: "SpecialistDetail",
    component: SpecialistDetail,
    props: true,
  },
  {
    path: "/specialist/:id/analysis-results",
    name: "SpecialistAnalysis",
    component: SpecialistAnalysis,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/specialist/analysis-results/:id",
    name: "SpecialistAnalysisDetail",
    component: SpecialistAnalysisDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/specialist/:id/bookings",
    name: "SpecialistBookings",
    component: SpecialistBookings,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/patient/:id/analysis-results",
    name: "PatientAnalysis",
    component: PatientAnalysis,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/patient/analysis-results/:id",
    name: "PatientAnalysisDetail",
    component: PatientAnalysisDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/patient/:id/bookings",
    name: "PatientBookings",
    component: PatientBookings,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
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
      { path: "specialists", name: "AdminSpecialists", component: Specialists },
      {
        path: "specialist-services",
        name: "AdminSpecialistServices",
        component: SpecialistServices,
      },
      { path: "bookings", name: "AdminBookings", component: Bookings },
      { path: "statistics", name: "AdminStatistics", component: Statistics },
      {
        path: "specialist/:id",
        name: "AdminSpecialistDetail",
        component: AdminSpecialistDetail,
      },
      {
        path: "specialist-service/:id",
        name: "AdminSpecialistServiceDetail",
        component: SpecialistServiceDetail,
        props: true,
      },
      {
        path: "analysis-results",
        name: "AdminAnalysisResults",
        component: AnalysisResults,
      },
      {
        path: "analysis-result/:id",
        name: "AdminAnalysisResultDetail",
        component: AnalysisResultDetail,
        props: true,
      },
      { path: "banners", name: "AdminBanners", component: Banners },
      {
        path: "achievements",
        name: "AdminAchievements",
        component: Achievements,
      },
      {
        path: "clinic-settings",
        name: "AdminClinicSettings",
        component: ClinicSettings,
      },
      { path: "socials", name: "AdminSocials", component: Socials },
      {
        path: "achievement/:id",
        name: "AdminAchievementDetail",
        component: AchievementDetail,
      },
      {
        path: "banner/:id",
        name: "AdminBannerDetail",
        component: BannerDetail,
      },
    ],
  },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if ((to.name === "Login" || to.name === "Register") && auth.accessToken) {
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

  next();
});

export default router;
