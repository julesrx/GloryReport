<template>
  <div
    id="global-alerts"
    class="max-w-2xl mx-auto mb-4 text-center bg-red-900 border-l-4 border-red-500"
    v-if="alerts.length"
  >
    <div class="p-2" v-for="alert in alerts" :key="alert.AlertKey" v-html="alert.AlertHtml"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { GlobalAlert, ServerResponse } from 'bungie-api-ts/core';

import api from '~/api';

// TODO: use suspense + async setup ?
export default defineComponent({
  setup() {
    const alerts = ref<GlobalAlert[]>([]);
    onMounted(async () => {
      const res = await api.get<ServerResponse<GlobalAlert[]>>('GlobalAlerts/');
      alerts.value = res.data.Response;
    });

    return { alerts };
  }
});
</script>
