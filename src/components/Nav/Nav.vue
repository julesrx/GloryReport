<template>
  <nav>
    <BungieGlobalAlerts />

    <div :class="['flex flex-wrap justify-center items-end select-none', isHome ? 'mb-4' : 'mb-2']">
      <AppLogo :class="isHome ? 'h-24' : 'h-16'" />
      <h1 :class="isHome ? 'text-3xl' : 'text-2xl'">
        <span :class="['font-semibold', isHome ? 'text-5xl' : 'text-4xl']">Glory</span>.report
      </h1>
    </div>
    <PlayerSearch :small="!isHome" class="mb-3" />
    <NavLinks v-if="showNavLinks" :profile="profile" />
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BungieGlobalAlerts from './BungieGlobalAlerts.vue';
import PlayerSearch from './PlayerSearch.vue';
import NavLinks from './NavLinks.vue';
import AppLogo from './AppLogo.vue';
import useProfile from '~/composables/useProfile';

export default defineComponent({
  components: { BungieGlobalAlerts, PlayerSearch, NavLinks, AppLogo },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const isHome = computed(() => {
      const homeRoute = router.options.routes.find(r => r.path === '/');
      return homeRoute ? route.matched.some(m => m.name === homeRoute.name) : false;
    });

    const profile = useProfile(route);
    const showNavLinks = computed(() => profile && profile.membershipType && profile.membershipId);

    return {
      isHome,

      profile,
      showNavLinks
    };
  }
});
</script>
