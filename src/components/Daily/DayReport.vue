<template>
  <pre>{{ activities }}</pre>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { DestinyHistoricalStatsPeriodGroupShort } from '~/interfaces';

export default defineComponent({
  props: ['activities']
});
</script>
