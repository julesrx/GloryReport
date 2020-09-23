<template>
  <div id="global-alerts" v-if="alerts.length">
    <div v-for="alert in alerts" :key="alert.AlertKey" v-html="alert.AlertHtml"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import * as api from '@/api';

export default defineComponent({
  name: 'BungieGlobalAlerts',
  async setup() {
    const res = await api.bhttp.get('GlobalAlerts/');
    const alerts = ref(res.data.Response);

    return { alerts };
  }
});
</script>
