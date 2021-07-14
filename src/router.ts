import { createRouter, createWebHistory } from 'vue-router';

import Home from 'views/Home.vue';

import Encounters from 'views/Encounters/Encounters.vue';
// import ReportEncounters from '@/views/Report/ReportEncounters.vue';
// import ReportEncounter from '@/views/Report/ReportEncounter.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Home
    },
    {
      name: 'Encounters',
      path: '/:membershipType/:membershipId',
      component: Encounters
    }

    //   {
    //     name: 'Report',
    //     path: '/:membershipType/:membershipId',
    //     component: Report,
    //     children: [
    //       {
    //         name: 'ReportEncounters',
    //         path: '',
    //         component: ReportEncounters
    //       },
    //       {
    //         name: 'ReportEncounter',
    //         path: ':selectedMembershipId',
    //         component: ReportEncounter
    //       }
    //     ]
    //   },
    //   {
    //     name: 'NotFound',
    //     path: '/:pathMatch(.*)*',
    //     component: () => import('@/views/NotFound.vue')
    //   }
  ]
});
