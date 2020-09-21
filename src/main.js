import Vue from 'vue';
import axios from 'axios';
import PQueue from 'p-queue';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.config.productionTip = false;

// add back Typescript when autocompletion and eslint can work with this next line
Vue.prototype.$http = axios.create();

// Bungie
Vue.prototype.$bhttp = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': process.env.VUE_APP_BUNGIE_API_KEY }
});
Vue.prototype.$bqueue = new PQueue({
  intervalCap: 20,
  interval: 1000
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
