<template>
  <div id="global-alerts" v-if="alerts && alerts.length">
    <div v-for="alert in alerts" :key="alert.AlertKey" v-html="alert.AlertHtml"></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from 'vue-property-decorator';
import { ServerResponse } from 'bungie-api-ts/common';
import { bhttp } from '@/http-common';

@Component
export default class Nav extends Vue {
  private alerts: any[] = [];

  async created(): Promise<void> {
    const { data } = await bhttp.get(`GlobalAlerts/`);
    const res: ServerResponse<any> = data;

    this.alerts = res.Response;
  }
}
</script>
