<template>
  <div class="encounter-item">
    <img :src="icon" :alt="encounter.displayName" height="48" width="48" />
    <span>{{ encounter.displayName }} ({{ encounter.count }})</span>
  </div>
</template>

<script lang="ts">
import Encounter from '@/classes/Encounter';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'EncounterItem',
  props: {
    encounter: {
      type: Encounter,
      required: true
    }
  },
  setup(props) {
    const icon = computed(() => `https://bungie.net${props.encounter.iconPath}`);

    return { icon };
  }
});
</script>
