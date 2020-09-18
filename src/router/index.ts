import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';
import PlayerReport from '../views/PlayerReport.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'PlayerReport',
    path: '/:membershipType/:membershipId',
    component: PlayerReport
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
