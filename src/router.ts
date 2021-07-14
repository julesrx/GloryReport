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
          component: ProfileHome
        },
        {
          name: 'Daily',
          path: 'daily',
          component: () => import('views/Profile/Daily/Daily.vue')
        }
        // {
        //   name: 'Encounters',
        //   path: 'encounters',
        //   component: Encounters,
        //   children: [
        //     {
        //       name: 'Encounter',
        //       path: ':selectedMembershipId',
        //       component: Encounter
        //     }
        //   ]
        // }
      ]
    }
  ]
});
