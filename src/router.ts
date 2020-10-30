import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from './views/Home.vue';
import PlayerReport from './views/PlayerReport.vue';
import EncounterDetail from './views/EncounterDetail.vue';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    component: Home
  },
  {
    name: 'PlayerReport',
    path: '/:membershipType/:membershipId',
    component: PlayerReport,
    children: [
      // add children with '' as path (like home)
      // this will the the root of the report view
      // store the current profile in the state to be able to route back to home
      {
        name: 'EncounterDetail',
        path: ':selectedMembershipId',
        component: EncounterDetail
      }
    ]
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
