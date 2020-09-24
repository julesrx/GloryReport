<template>
  <a :href="dtr" target="_blank" v-if="pgcr">{{ pgcr.period }}</a>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';

import { getCachedPGCR } from '@/api';

export default defineComponent({
  name: 'ActivityItem',
  props: {
    instanceId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const pgcr = ref((null as unknown) as DestinyPostGameCarnageReportData);
    getCachedPGCR(props.instanceId).then(res => (pgcr.value = res));

    const dtr = computed(() => `https://destinytracker.com/destiny-2/pgcr/${props.instanceId}`);

    return { pgcr, dtr };
  }
});
</script>
