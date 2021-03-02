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
import { defineComponent } from 'vue';
import * as api from '@/api';

export default defineComponent({
  data() {
    return {
      alerts: []
    };
  },
  async created() {
    const res = await api.bhttp.get('GlobalAlerts/');
    this.alerts = res.data.Response;
  }
});
</script>
