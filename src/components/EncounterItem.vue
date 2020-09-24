<template>
  <div class="encounter-item">
    <img :src="icon" :alt="encounter.displayName" height="48" width="48" />
    <span>{{ encounter.displayName }} ({{ encounter.count }})</span>

    <ul v-if="selected">
      <li v-for="instanceId in encounter.instanceIds" :key="instanceId">
        <ActivityItem :instanceId="instanceId" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';

import Encounter from '@/classes/Encounter';
import ActivityItem from '@/components/ActivityItem.vue';

export default defineComponent({
  name: 'EncounterItem',
  components: {
    ActivityItem
  },
  props: {
    encounter: {
      type: Encounter,
      required: true
    },
    selected: Boolean
  },
  setup(props) {
    const icon = computed(() => `https://bungie.net${props.encounter.iconPath}`);

      return { icon };
  }
});
</script>
