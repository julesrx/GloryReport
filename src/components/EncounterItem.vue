<template>
  <div class="encounter-item" v-if="shouldBeDisplayed">
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
  async created() {
    // console.log(this.encounter);
  },
  computed: {
    iconUrl() {
      return `https://bungie.net${this.encounter.iconPath}`; // can be undefined
    },
    shouldBeDisplayed() {
      return this.encounter.displayName && this.encounter.iconPath;
    }
  }
};
</script>
