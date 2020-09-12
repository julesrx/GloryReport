<template>
  <nav id="nav">
    <BungieGlobalAlerts />
    <PlayerSearch />
    <router-link to="/">Home</router-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BungieGlobalAlerts from '@/components/BungieGlobalAlerts.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';

@Component({
  components: {
    BungieGlobalAlerts,
    PlayerSearch
  }
})
export default class Nav extends Vue {}
</script>
