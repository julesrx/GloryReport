<template>
  <a :href="dtr" target="_blank" class="activity-item flex items-center py-2 hover:bg-dark-600">
    <p v-if="loading">Loading details...</p>
    <template v-if="!loading && pgcr">
      <div :class="['h-6 w-1 mr-2', win ? 'bg-green-600' : null]"></div>
      <DateDistance :date="pgcr.period" />

      <div class="flex-1"></div>
      <StatItem :title="'Score'" :value="score" />
      <StatItem :title="'KD'" :value="kd" class="ml-2" />
      <StatItem :title="'KDA'" :value="kda" class="ml-2" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        height="1em"
        width="1em"
        class="ml-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </template>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

import { getCachedPGCR } from '@/api';
import DateDistance from '@/components/utils/DateDistance.vue';
import StatItem from '@/components/StatItem.vue';

export default defineComponent({
  components: {
    DateDistance,
    StatItem
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
      pgcr: null as DestinyPostGameCarnageReportData | null,

      win: false,
      score: '',
      kd: '',
      kda: ''
    };
  },
  async created() {
    try {
      this.pgcr = await getCachedPGCR(this.instanceId);
    } finally {
      this.loading = false;
    }

    if (this.pgcr) {
      const membershipId = this.$route.params['membershipId'] as string;
      const entry = this.pgcr.entries.find(
        e => e.player.destinyUserInfo.membershipId === membershipId
      );
      if (entry) {
        this.win = entry.values['standing'].basic.value === 0;
        this.score = entry.score.basic.displayValue;
        this.kd = entry.values['killsDeathsRatio'].basic.displayValue;
        this.kda = entry.values['killsDeathsAssists'].basic.displayValue;
      }
    }
  },
  computed: {
    dtr(): string {
      return `https://destinytracker.com/destiny-2/pgcr/${this.instanceId}`;
    }
  }
});
</script>
