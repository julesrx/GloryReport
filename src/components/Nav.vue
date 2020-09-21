<template>
  <div id="nav">
    <BungieGlobalAlerts />
    <PlayerSearch />
    <router-link to="/">Home</router-link>
  </div>
</template>

<script>
import BungieGlobalAlerts from '@/components/BungieGlobalAlerts.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';

export default {
  name: 'Nav',
  components: {
    BungieGlobalAlerts,
    PlayerSearch
  }
};
</script>
