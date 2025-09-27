import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import { IMaskDirective } from "vue-imask";
import "@fortawesome/fontawesome-free/css/all.min.css";
import VueApexCharts from "vue3-apexcharts";

import "./assets/style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.directive("imask", IMaskDirective);
app.use(VueApexCharts);

app.mount("#app");
