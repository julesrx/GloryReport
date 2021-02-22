import { createApp } from "vue";
import App from "./App.vue";

import "./main.css";
import "windi.css";

import router from "./router";

createApp(App).use(router).mount("#app");
