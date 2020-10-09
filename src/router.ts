import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from './views/Home.vue';
import PlayerReport from './views/PlayerReport.vue';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'PlayerReport',
    path: '/:membershipType/:membershipId',
    component: PlayerReport
  },
  {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    component: () => import(/* webpackChunkName: "not-found" */ './views/NotFound.vue')
  }
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // the app is deployed on GitHub Pages atm, so legacy mode is required
  // Netlify or Vercel could be nice
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
