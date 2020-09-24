<template>
  <nav>
    <BungieGlobalAlerts />

    <div class="flex flex-wrap justify-center items-end mt-8 mb-4">
      <img src="@/assets/logo.png" alt="Glory.report" class="h-24" />
      <h1 class="text-3xl"><span class="text-5xl font-semibold">Glory</span>.report</h1>
    </div>
    <PlayerSearch />
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
