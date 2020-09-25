<template>
  <tr class="hover:bg-dark-600 cursor-pointer" @click="$emit('select')">
    <td :class="['text-center', showBorders && !isSelected ? cellBorder : null, cellSpacing]">
      {{ ranking }}
    </td>
    <td :class="[showBorders && !isSelected ? cellBorder : null, cellSpacing]">
      <div class="flex items-center">
        <img :src="icon" :alt="encounter.displayName" height="48" width="48" />
        <span class="ml-2">{{ encounter.displayName }}</span>
      </div>
    </td>
    <td :class="['text-right', showBorders && !isSelected ? cellBorder : null, cellSpacing]">
      {{ encounter.count }}
    </td>
  </tr>

  <tr v-if="isSelected">
    <td colspan="3" :class="['px-10 py-2', showBorders ? cellBorder : null]">
      <p>{{ encounter.instanceIds.length }} activities</p>
      <div class="divide-y divide-dark-400">
        <ActivityItem
          v-for="instanceId in encounter.instanceIds"
          :key="instanceId"
          :instanceId="instanceId"
          class="max-w-4xl mx-auto"
        />
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Encounter } from '@/models';
import ActivityItem from '@/components/ActivityItem.vue';

export default defineComponent({
  name: 'EncounterRow',
  components: {
    ActivityItem
  },
  emits: ['select'],
  props: {
    encounter: {
      type: Encounter,
      required: true
    },
    ranking: {
      type: Number,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    showBorders: Boolean,
    cellBorder: String,
    cellSpacing: String
  },
  computed: {
    icon(): string {
      return `https://bungie.net${this.encounter.iconPath}`;
    }
  }
});
</script>
