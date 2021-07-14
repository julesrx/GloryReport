import { createApp } from 'vue';
import { loadManifest } from '~/manifest';
import App from '~/App.vue';
import router from '~/router';

import 'virtual:windi.css';
// import './main.css';

createApp(App).use(router).mount('#app');

loadManifest();
