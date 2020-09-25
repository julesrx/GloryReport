<template>
  <tr :class="isSelected ? null : 'hover:bg-dark-600 cursor-pointer'" @click="$emit('select')">
    <td :class="['text-center', isLast ? null : cellBorder, cellSpacing]">
      {{ ranking }}
    </td>
    <td :class="[isLast ? null : cellBorder, cellSpacing]">
      <div class="flex items-center">
        <img :src="icon" :alt="encounter.displayName" height="48" width="48" />
        <span class="ml-2">{{ encounter.displayName }}</span>
      </div>
    </td>
    <td :class="['text-right', isLast ? null : cellBorder, cellSpacing]">
      {{ encounter.count }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Encounter from '@/classes/Encounter';

export default defineComponent({
  name: 'EncounterRow',
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
    isLast: Boolean,
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
