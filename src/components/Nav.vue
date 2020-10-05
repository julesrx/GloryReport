<template>
  <nav>
    <BungieGlobalAlerts />

    <router-link
      :to="{ name: 'Home' }"
      :class="['flex flex-wrap justify-center items-end', isHome ? 'mb-4' : 'mb-2']"
    >
      <img src="@/assets/logo.png" alt="Glory.report" :class="isHome ? 'h-24' : 'h-16'" />
      <h1 :class="isHome ? 'text-3xl' : 'text-2xl'">
        <span :class="['font-semibold', isHome ? 'text-5xl' : 'text-4xl']">Glory</span>.report
      </h1>
    </router-link>
    <PlayerSearch :small="!isHome" />
  </nav>
</template>

<script lang="ts">
import BungieGlobalAlerts from '@/components/BungieGlobalAlerts.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    BungieGlobalAlerts,
    PlayerSearch
  },
  computed: {
    isHome(): boolean {
      const homeRoute = this.$router.options.routes.find(r => r.path === '/');
      return homeRoute ? this.$route.matched.some(m => m.name === homeRoute.name) : false;
    }
  }
});
</script>
