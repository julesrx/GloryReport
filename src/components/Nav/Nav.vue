<template>
  <nav>
    <BungieGlobalAlerts />

    <AppLogo :small="true" :use-link="true" class="mb-2" />
    <PlayerSearch :small="true" class="mb-3" />

    <NavLinks v-if="showNavLinks" :profile="profile" />
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

import BungieGlobalAlerts from './BungieGlobalAlerts.vue';
import PlayerSearch from './PlayerSearch.vue';
import NavLinks from './NavLinks.vue';
import AppLogo from 'components/AppLogo.vue';
import useProfile from '~/composables/useProfile';

export default defineComponent({
  components: { BungieGlobalAlerts, PlayerSearch, NavLinks, AppLogo },
  setup() {
    const route = useRoute();
    const profile = useProfile(route);

    const showNavLinks = computed(() => profile && profile.membershipType && profile.membershipId);

    return { profile, showNavLinks };
  }
});
</script>
