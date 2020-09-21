<template>
  <div class="encounter-item">
    <img :src="iconUrl" :alt="encounter.displayName" height="48" width="48" />
    <span>{{ encounter.displayName }} ({{ encounter.count }})</span>
  </div>
</template>

<script>
import Encounter from '@/classes/Encounter';

export default {
  name: 'EncounterItem',
  props: {
    encounter: Encounter
  },
  computed: {
    iconUrl() {
      return `https://bungie.net${this.encounter.iconPath}`; // can be undefined
    }
  }
};
</script>
