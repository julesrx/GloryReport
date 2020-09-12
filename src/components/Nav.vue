<template>
  <nav id="nav">
    <BungieGlobalAlerts />
    <router-link to="/">Home</router-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BungieGlobalAlerts from '@/components/BungieGlobalAlerts.vue';

@Component({
  components: {
    BungieGlobalAlerts
  }
})
export default class Nav extends Vue {}
</script>
