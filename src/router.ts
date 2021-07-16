import { createRouter, createWebHistory } from 'vue-router';

import Home from 'views/Home.vue';

import Profile from 'views/Profile/Profile.vue';
import ProfileHome from 'views/Profile/ProfileHome.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home
    },
    {
      name: 'Profile',
      path: '/:membershipType/:membershipId',
      component: Profile,
      children: [
        {
          name: 'ProfileHome',
          path: '',
          component: ProfileHome,
          redirect: { name: 'EncountersRecap' }
        },
        {
          name: 'Encounters',
          path: 'encounters',
          component: () => import('views/Profile/Encounters/Encounters.vue'),
          redirect: { name: 'EncountersRecap' },
          children: [
            {
              name: 'EncountersRecap',
              path: '',
              component: () => import('views/Profile/Encounters/EncountersRecap.vue')
            },
            {
              name: 'EncountersDetail',
              path: ':selectedMembershipId',
              component: () => import('views/Profile/Encounters/EncountersDetail.vue')
            }
          ]
        },
        {
          name: 'Daily',
          path: 'daily',
          component: () => import('views/Profile/Daily/Daily.vue')
        }
      ]
    }
  ]
});
