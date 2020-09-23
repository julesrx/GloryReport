<template>
  <nav>
    <BungieGlobalAlerts />
    <PlayerSearch />
    <router-link to="/">Home</router-link>
  </nav>
</template>

<script lang="ts">
import BungieGlobalAlerts from '@/components/BungieGlobalAlerts.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Nav',
  components: {
    BungieGlobalAlerts,
    PlayerSearch
  }
});
</script>
