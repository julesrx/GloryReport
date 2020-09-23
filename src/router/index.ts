import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import PlayerReport from '../views/PlayerReport.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    name: 'PlayerReport',
    path: '/:membershipType/:membershipId',
    component: PlayerReport
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
