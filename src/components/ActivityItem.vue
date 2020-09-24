<template>
  <p v-if="loading">loading pgcr...</p>
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
  async setup(props) {
    const loading = ref(true);
    const pgcr = ref((null as unknown) as DestinyPostGameCarnageReportData);

    try {
      const res = await getCachedPGCR(props.instanceId);
      console.log(res);

      if (res !== null) pgcr.value = res; // not working
    } finally {
      loading.value = true;
    }

    const dtr = computed(() => `https://destinytracker.com/destiny-2/pgcr/${props.instanceId}`);

    return { loading, pgcr, dtr };
  }
});
</script>
