<template>
  <div class="encounter-item">
    <div :class="['flex', selected ? null : 'cursor-pointer']">
      <span class="text-lg text-right w-16 mr-2">#{{ ranking }}</span>
      <img :src="icon" :alt="encounter.displayName" height="48" width="48" />
      <div class="ml-2">
        <div>{{ encounter.displayName }}</div>
        <div class="mt-1 text-sm opacity-75">{{ encounter.count }} matches</div>
      </div>

      <template v-if="selected">
        <div class="flex-1"></div>
        <button @click.stop="$emit('deselect')">&times;</button>
      </template>
    </div>

    <div class="ml-20 mt-2" v-if="selected">
      <ActivityItem
        v-for="instanceId in encounter.instanceIds"
        :key="instanceId"
        :instanceId="instanceId"
      />
    </div>
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
    ranking: Number,
    selected: Boolean
  },
  computed: {
    icon(): string {
      return `https://bungie.net${this.encounter.iconPath}`;
    }
  }
});
</script>
