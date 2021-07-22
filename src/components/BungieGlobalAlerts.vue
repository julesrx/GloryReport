<template>
  <teleport to="body">
    <div
      id="global-alerts"
      class="fixed top-0 right-0 max-w-2xl text-right bg-red-900 border-r-4 m-2 border-red-500"
      v-if="alerts.length"
    >
      <div class="p-2 space-y-2" v-for="alert in alerts" :key="alert.AlertKey">
        <div v-html="alert.AlertHtml"></div>
        <a
          class="flex items-center justify-end space-x-1 opacity-75 hover:(underline opacity-100)"
          v-if="alert.AlertLink"
          :href="alert.AlertLink"
        >
          <span>{{ alert.AlertLink }}</span>
          <ExternalLinkIcon class="h-4 w-4" />
        </a>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { GlobalAlert, ServerResponse } from 'bungie-api-ts/core';
import { ExternalLinkIcon } from '@heroicons/vue/solid';

import api from '~/api';

export default defineComponent({
  components: { ExternalLinkIcon },
  setup() {
    const alerts = ref<GlobalAlert[]>([]);
    onMounted(async () => {
      const res = await api.get<ServerResponse<GlobalAlert[]>>('GlobalAlerts/');
      alerts.value = res.data.Response.filter(a => !!a.AlertHtml);
    });

    return { alerts };
  }
});
</script>
