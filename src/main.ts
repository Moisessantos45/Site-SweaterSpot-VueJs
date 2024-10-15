import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin, defaultConfig } from "@formkit/vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./config/firebase";
import "./style.css";
import App from "./App.vue";
import router from "./routers/routers";
import config from "../formkit.config";

const app = createApp(App);
const pinia = createPinia();

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(router);
app.use(pinia);
app.use(plugin, defaultConfig(config));
app.use(VueQueryPlugin);
app.mount("#app");
