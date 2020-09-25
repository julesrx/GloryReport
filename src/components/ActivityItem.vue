<template>
  <div class="activity-item">
    <p v-if="loading">Loading activity...</p>
    <div class="flex" v-if="pgcr">
      <DateDistance :date="pgcr.period" />

      <div class="flex-1"></div>
      <a :href="dtr" target="_blank" class="text-sm">DestinyTracker</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

import { getCachedPGCR } from '@/api';
import DateDistance from '@/components/utils/DateDistance.vue';

export default defineComponent({
  name: 'ActivityItem',
  components: {
    DateDistance
  },
  props: {
    instanceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      pgcr: null as DestinyPostGameCarnageReportData | null
    };
  },
  async created() {
    try {
      this.pgcr = await getCachedPGCR(this.instanceId);
    } finally {
      this.loading = false;
    }
  },
  computed: {
    dtr(): string {
      return `https://destinytracker.com/destiny-2/pgcr/${this.instanceId}`;
    }
  }
});
</script>
