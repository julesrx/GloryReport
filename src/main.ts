import { createApp } from 'vue';
import { loadManifest } from './manifest';
import App from './App.vue';

import 'virtual:windi.css';

createApp(App).mount('#app');

loadManifest();
