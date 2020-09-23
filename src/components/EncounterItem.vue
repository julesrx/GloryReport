<template>
  <div class="encounter-item">
    <img :src="iconUrl" :alt="encounter.displayName" height="48" width="48" />
    <span>{{ encounter.displayName }} ({{ encounter.count }})</span>
  </div>
</template>

<script lang="ts">
import Encounter from '@/classes/Encounter';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EncounterItem',
  props: {
    encounter: {
      type: Encounter,
      required: true
    }
  },
  computed: {
    iconUrl(): string {
      return `https://bungie.net${this.encounter.iconPath}`;
    }
  }
});
</script>
