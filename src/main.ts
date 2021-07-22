import { createApp } from 'vue';
import { loadManifest } from '~/stores/manifest';
import App from '~/App.vue';
import router from '~/router';

import 'inter-ui/inter.css';
import 'virtual:windi.css';
import './main.css';

createApp(App).use(router).mount('#app');

loadManifest();
