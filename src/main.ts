import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import axios from 'axios';

Vue.config.productionTip = true;

Vue.prototype.$http = axios;
Vue.prototype.$bhttp = axios.create({
  baseURL: 'https://stats.bungie.net/Platform/',
  headers: { 'X-Api-Key': process.env.VUE_APP_BUNGIE_API_KEY }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
