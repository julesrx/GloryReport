<template>
  <div class="encounter-item">
    <img :src="icon" :alt="encounter.displayName" height="48" width="48" />
    <span>{{ encounter.displayName }} ({{ encounter.count }})</span>

    <template v-if="selected">
      <button @click.stop="$emit('deselect')">Deselect</button>

      <ActivityItem
        v-for="instanceId in encounter.instanceIds"
        :key="instanceId"
        :instanceId="instanceId"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  computed: {
    icon(): string {
      return `https://bungie.net${this.encounter.iconPath}`;
    }
  }
});
</script>
